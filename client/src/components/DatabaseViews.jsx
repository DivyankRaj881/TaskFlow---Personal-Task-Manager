import React from "react";

function formatDueDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DatabaseViews({ tasks, view, onToggle, onSelectTask }) {
  // Sort tasks or categorize them for Board view
  const columns = {
    high: tasks.filter((t) => t.priority === "high"),
    medium: tasks.filter((t) => t.priority === "medium" || !t.priority),
    low: tasks.filter((t) => t.priority === "low"),
  };

  if (view === "table") {
    return (
      <div className="notion-table-wrapper">
        <table className="notion-table">
          <thead>
            <tr>
              <th style={{ width: "32px" }}></th>
              <th>Name</th>
              <th>Description</th>
              <th style={{ width: "120px" }}>Priority</th>
              <th style={{ width: "140px" }}>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="notion-table-row">
                <td className="table-checkbox-cell">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggle(task.id)}
                      aria-label="Toggle task completion"
                    />
                    <span className="checkmark" />
                  </label>
                </td>
                <td className="table-title-cell" onClick={() => onSelectTask(task)}>
                  <span className={`table-task-title ${task.completed ? "completed" : ""}`}>
                    {task.title}
                  </span>
                </td>
                <td className="table-desc-cell" onClick={() => onSelectTask(task)}>
                  <span className="table-task-desc">{task.description || "—"}</span>
                </td>
                <td onClick={() => onSelectTask(task)}>
                  <span className={`priority-badge priority-${task.priority || "medium"}`}>
                    {task.priority || "medium"}
                  </span>
                </td>
                <td className="table-date-cell" onClick={() => onSelectTask(task)}>
                  <span>{formatDueDate(task.due_date) || "—"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (view === "board") {
    return (
      <div className="notion-board">
        {Object.entries(columns).map(([priorityKey, colTasks]) => (
          <div key={priorityKey} className="board-column">
            <div className="board-column-header">
              <span className={`priority-badge priority-${priorityKey}`}>
                {priorityKey.toUpperCase()}
              </span>
              <span className="column-count">{colTasks.length}</span>
            </div>

            <div className="board-cards-container">
              {colTasks.length === 0 ? (
                <div className="board-card-empty">No tasks</div>
              ) : (
                colTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`board-card ${task.completed ? "completed" : ""}`}
                    onClick={() => onSelectTask(task)}
                  >
                    <div className="board-card-header">
                      <label
                        className="toggle-label"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggle(task.id)}
                        />
                        <span className="checkmark" />
                      </label>
                      <span className="board-card-title">{task.title}</span>
                    </div>
                    {task.description && (
                      <p className="board-card-desc">{task.description}</p>
                    )}
                    {task.due_date && (
                      <span className="board-card-date">
                        🗓️ {formatDueDate(task.due_date)}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default List View
  return (
    <div className="notion-list">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`notion-list-item ${task.completed ? "completed" : ""}`}
          onClick={() => onSelectTask(task)}
        >
          <div className="list-item-left">
            <label className="toggle-label" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
              />
              <span className="checkmark" />
            </label>
            <span className="list-item-title">{task.title}</span>
          </div>
          <div className="list-item-right">
            <span className={`priority-badge priority-${task.priority || "medium"}`}>
              {task.priority || "medium"}
            </span>
            {task.due_date && (
              <span className="list-item-date">
                🗓️ {formatDueDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DatabaseViews;
