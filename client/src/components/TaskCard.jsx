import React, { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isOverdue(task) {
  if (!task.due_date || task.completed) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(task.due_date + "T00:00:00");
  return due < today;
}

function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.due_date || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.due_date || "");
    setPriority(task.priority || "medium");
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (error) setError("");
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    setIsSaving(true);
    const result = await onEdit(task.id, {
      title: trimmedTitle,
      description: description.trim(),
      due_date: dueDate || null,
      completed: task.completed,
      priority,
    });
    setIsSaving(false);

    if (!result.success) {
      setError(result.error || "Failed to update task. Please try again.");
      return;
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.due_date || "");
    setPriority(task.priority || "medium");
    setIsEditing(false);
    setError("");
  };

  const openDeleteConfirm = () => setShowDeleteConfirm(true);

  const closeDeleteConfirm = () => setShowDeleteConfirm(false);

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(task.id);
  };

  if (isEditing) {
    return (
      <article className={`task-card editing ${task.completed ? "completed" : ""}`}>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <label htmlFor={`edit-title-${task.id}`} className="visually-hidden">
          Title
        </label>
        <input
          id={`edit-title-${task.id}`}
          type="text"
          value={title}
          onChange={handleTitleChange}
          className={`edit-input ${error === "Title is required" ? "input-error" : ""}`}
          required
          aria-invalid={error === "Title is required"}
          disabled={isSaving}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="edit-input"
          placeholder="Description"
          disabled={isSaving}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="edit-input"
          disabled={isSaving}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="edit-input edit-select"
          disabled={isSaving}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="task-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </article>
    );
  }

  const overdue = isOverdue(task);

  return (
    <>
      <article
        className={`task-card ${task.completed ? "completed" : ""} ${overdue ? "overdue" : ""}`}
      >
        <div className="task-header">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              aria-label={task.completed ? "Mark as active" : "Mark as completed"}
            />
            <span className="checkmark" aria-hidden="true" />
          </label>
          <div className="task-body">
            <div className="task-title-row">
              <h3 className="task-title">{task.title}</h3>
              <span className={`priority-badge priority-${task.priority || "medium"}`}>
                {task.priority || "medium"}
              </span>
              {overdue && <span className="overdue-badge">Overdue</span>}
            </div>

            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            {task.due_date && (
              <div className="task-meta">
                <p className={`task-due ${overdue ? "task-due-overdue" : ""}`}>
                  {formatDueDate(task.due_date)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="task-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={startEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={openDeleteConfirm}
            aria-haspopup="dialog"
          >
            Delete
          </button>
        </div>
      </article>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete task?"
          message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
          cancelLabel="Cancel"
          confirmLabel="Yes, delete"
          onCancel={closeDeleteConfirm}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}

export default TaskCard;
