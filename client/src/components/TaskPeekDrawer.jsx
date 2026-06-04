import { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";

function TaskPeekDrawer({ task, isOpen, onClose, onAdd, onEdit, onDelete }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.due_date || "");
      setPriority(task.priority || "medium");
      setCompleted(Boolean(task.completed));
      setError("");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handlePressSave = async () => {
    setIsSaving(true);
    const updatedData = {
      title: title.trim() || "Untitled Task",
      description: description.trim(),
      due_date: dueDate || null,
      priority,
      completed,
    };

    if (!title.trim()) {
      setError("Title is required");
      setIsSaving(false);
      return;
    }

    if (task.isNew) {
      const result = await onAdd(updatedData);
      setIsSaving(false);
      if (!result.success) {
        setError(result.error || "Failed to create task");
      } else {
        setError("");
        onClose();
      }
    } else {
      const result = await onEdit(task.id, updatedData);
      setIsSaving(false);
      if (!result.success) {
        setError(result.error || "Failed to update task");
      } else {
        setError("");
        onClose();
      }
    }
  };

  const handlePressCancel = () => {
    setTitle(task.title || "");
    setDescription(task.description || "");
    setDueDate(task.due_date || "");
    setPriority(task.priority || "medium");
    setCompleted(Boolean(task.completed));
    setError("");
    onClose();
  };

  const handleToggleCompleted = () => {
    setCompleted(!completed);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    onDelete(task.id);
    onClose();
  };

  return (
    <>
      <div className="peek-overlay" onClick={handlePressCancel} />
      <aside className="peek-drawer" aria-label="Task Details">
        <div className="peek-header">
          <button
            type="button"
            className="peek-close-btn"
            onClick={handlePressCancel}
            aria-label="Close details"
          >
            ✕ Close
          </button>
          <div className="peek-header-actions">
            {!task.isNew && (
              <button
                type="button"
                className="btn-peek-action btn-peek-delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="peek-content">
          <div className="peek-property-row">
            <div className="peek-property-label">Status</div>
            <div className="peek-property-value">
              <button
                type="button"
                className={`peek-status-toggle ${completed ? "completed" : "active"}`}
                onClick={handleToggleCompleted}
              >
                <span className={`status-dot ${completed ? "completed" : "active"}`} />
                {completed ? "Completed" : "Active"}
              </button>
            </div>
          </div>

          <div className="peek-property-row">
            <div className="peek-property-label">Priority</div>
            <div className="peek-property-value">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`peek-priority-select select-${priority}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="peek-property-row">
            <div className="peek-property-label">Due Date</div>
            <div className="peek-property-value">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="peek-date-input"
              />
            </div>
          </div>

          <hr className="peek-divider" />

          {error && <p className="form-error peek-error">{error}</p>}

          <input
            type="text"
            className="peek-title-input"
            value={title}
            placeholder="Untitled"
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
          />

          <textarea
            className="peek-desc-input"
            value={description}
            placeholder="Add a description..."
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
          />
        </div>

        <div className="peek-footer">
          <button
            type="button"
            className="btn-drawer-save"
            onClick={handlePressSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn-drawer-cancel"
            onClick={handlePressCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>

        {isSaving && <div className="peek-saving-indicator">Saving...</div>}
      </aside>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete task?"
          message={`Are you sure you want to delete this task? This action cannot be undone.`}
          cancelLabel="Cancel"
          confirmLabel="Yes, delete"
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

export default TaskPeekDrawer;
