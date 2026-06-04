import { useCallback, useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm";
import SearchBar from "./components/SearchBar";
import FilterButtons from "./components/FilterButtons";
import EmptyState from "./components/EmptyState";
import DatabaseViews from "./components/DatabaseViews";
import TaskPeekDrawer from "./components/TaskPeekDrawer";
import {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} from "./services/api";
import { getApiErrorMessage } from "./utils/apiErrors";
import "./App.css";

function matchesStatusFilter(task, filter) {
  const completed = Boolean(task.completed);
  if (filter === "active") return !completed;
  if (filter === "completed") return completed;
  return true;
}

function matchesTitleSearch(task, query) {
  if (!query) return true;
  return task.title.toLowerCase().includes(query);
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  // Notion state extensions
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dbView, setDbView] = useState("list"); // 'list' | 'table' | 'board'
  const [activeTaskForPeek, setActiveTaskForPeek] = useState(null);
  const [isPeekOpen, setIsPeekOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      setError("");
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to load tasks");
      setError(message);
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAdd = async (taskData) => {
    try {
      setError("");
      const newTask = await createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      return { success: true, task: newTask };
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to add task");
      setError(message);
      return { success: false, error: message };
    }
  };

  const handleEdit = async (id, taskData) => {
    try {
      setError("");
      const updated = await updateTask(id, taskData);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      
      // Update selected task in peek drawer if it's the one edited
      if (activeTaskForPeek && activeTaskForPeek.id === id) {
        setActiveTaskForPeek(updated);
      }
      return { success: true, task: updated };
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to update task");
      setError(message);
      return { success: false, error: message };
    }
  };

  const handleToggle = async (id) => {
    try {
      setError("");
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      
      if (activeTaskForPeek && activeTaskForPeek.id === id) {
        setActiveTaskForPeek(updated);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to toggle task"));
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      
      if (activeTaskForPeek && activeTaskForPeek.id === id) {
        setIsPeekOpen(false);
        setActiveTaskForPeek(null);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete task"));
    }
  };

  // Create a new task draft and open it in Peek drawer without saving to DB yet
  const handleAddNewTask = () => {
    const defaultTaskData = {
      id: "new-draft",
      title: "",
      description: "",
      due_date: "",
      priority: "medium",
      completed: false,
      isNew: true,
    };
    setActiveTaskForPeek(defaultTaskData);
    setIsPeekOpen(true);
  };

  const handleSelectTask = (task) => {
    setActiveTaskForPeek(task);
    setIsPeekOpen(true);
  };

  const taskStats = useMemo(() => {
    const active = tasks.filter((t) => !t.completed).length;
    const completed = tasks.filter((t) => t.completed).length;
    return { all: tasks.length, active, completed };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = tasks.filter(
      (task) =>
        matchesStatusFilter(task, filter) && matchesTitleSearch(task, query)
    );

    const PRIORITY_MAP = { high: 3, medium: 2, low: 1 };

    return [...filtered].sort((a, b) => {
      if (sortBy === "dueDate") {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      }
      if (sortBy === "priority") {
        const priorityA = PRIORITY_MAP[a.priority] || 2;
        const priorityB = PRIORITY_MAP[b.priority] || 2;
        if (priorityA !== priorityB) {
          return priorityB - priorityA;
        }
      }
      return b.id - a.id;
    });
  }, [tasks, searchQuery, filter, sortBy]);

  const hasSearch = Boolean(searchQuery.trim());

  const emptyMessage = useMemo(() => {
    if (hasSearch && filter === "active") {
      return "No active tasks match that title.";
    }
    if (hasSearch && filter === "completed") {
      return "No completed tasks match that title.";
    }
    if (hasSearch) {
      return "No tasks match that title.";
    }
    if (filter === "active") {
      return "No active tasks.";
    }
    if (filter === "completed") {
      return "No completed tasks.";
    }
    return "No tasks found.";
  }, [hasSearch, filter]);

  const showResultsSummary =
    !loading && tasks.length > 0 && (hasSearch || filter !== "all");

  return (
    <div className="app-container">
      {/* Collapsible Left Sidebar */}
      <aside className={`app-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-profile">
            <span>Task Manager</span>
          </div>
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={() => setIsSidebarCollapsed(true)}
            aria-label="Collapse sidebar"
          >
            ◀
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`sidebar-nav-item ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            <span className="nav-item-left">📋 All Tasks</span>
            <span className="nav-item-count">{taskStats.all}</span>
          </button>
          <button
            type="button"
            className={`sidebar-nav-item ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            <span className="nav-item-left">⭕ Active Tasks</span>
            <span className="nav-item-count">{taskStats.active}</span>
          </button>
          <button
            type="button"
            className={`sidebar-nav-item ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            <span className="nav-item-left">✅ Completed Tasks</span>
            <span className="nav-item-count">{taskStats.completed}</span>
          </button>
        </nav>

        <hr className="sidebar-divider" />

        <div className="sidebar-stats-section">
          <div className="sidebar-stats-title">Progress Overview</div>
          <div className="sidebar-stats-grid">
            <div className="stat-item">
              <span>Active</span>
              <span>{taskStats.active}</span>
            </div>
            <div className="stat-item">
              <span>Completed</span>
              <span>{taskStats.completed}</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={handleAddNewTask}
          >
            + New Task
          </button>
        </div>
      </aside>

      {/* Floating Toggle to Restore Sidebar */}
      {isSidebarCollapsed && (
        <button
          type="button"
          className="sidebar-expand-btn"
          onClick={() => setIsSidebarCollapsed(false)}
          aria-label="Expand sidebar"
        >
          ▶ Menu
        </button>
      )}

      {/* Main Workspace Workspace */}
      <main className="notion-workspace">
        <div className="notion-cover" />
        <div className="notion-content">

          <header className="notion-header">
            <h1>Personal Task Manager</h1>
            <p className="notion-tagline">Stay Organised and Plan Better</p>
          </header>

          {error && (
            <div className="app-error" role="alert" style={{ marginBottom: "20px" }}>
              <p className="app-error-text">{error}</p>
              <div className="app-error-actions">
                {loadFailed && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={fetchTasks}
                  >
                    Try again
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setError("");
                    setLoadFailed(false);
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Database Views Tab Bar */}
          <div className="notion-view-tabs">
            <button
              type="button"
              className={`view-tab ${dbView === "list" ? "active" : ""}`}
              onClick={() => setDbView("list")}
            >
              ☰ List View
            </button>
            <button
              type="button"
              className={`view-tab ${dbView === "table" ? "active" : ""}`}
              onClick={() => setDbView("table")}
            >
              田 Table View
            </button>
            <button
              type="button"
              className={`view-tab ${dbView === "board" ? "active" : ""}`}
              onClick={() => setDbView("board")}
            >
              ☷ Board View
            </button>
          </div>

          {/* Database Actions Toolbar */}
          <div className="notion-toolbar">
            <div className="toolbar-left">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <div className="toolbar-right">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
                aria-label="Sort options"
              >
                <option value="createdAt">Newest First</option>
                <option value="dueDate">Due Date (Soonest)</option>
                <option value="priority">Priority (Highest)</option>
              </select>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddNewTask}
              >
                + New
              </button>
            </div>
          </div>

          {showResultsSummary && (
            <p className="results-summary" aria-live="polite">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </p>
          )}

          {/* Task Database View Content */}
          {loading ? (
            <p className="status-message">Loading tasks...</p>
          ) : loadFailed ? (
            <p className="status-message">
              Tasks could not be loaded. Use Try again above.
            </p>
          ) : tasks.length === 0 ? (
            <EmptyState
              title="No Tasks Found"
              message="Create your first task using the '+ New' button"
            />
          ) : filteredTasks.length === 0 ? (
            <p className="status-message">{emptyMessage}</p>
          ) : (
            <DatabaseViews
              tasks={filteredTasks}
              view={dbView}
              onToggle={handleToggle}
              onSelectTask={handleSelectTask}
            />
          )}
        </div>
      </main>

      {/* Notion Side Peek Drawer for Task Editing */}
      <TaskPeekDrawer
        task={activeTaskForPeek}
        isOpen={isPeekOpen}
        onClose={() => {
          setIsPeekOpen(false);
          setActiveTaskForPeek(null);
        }}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
