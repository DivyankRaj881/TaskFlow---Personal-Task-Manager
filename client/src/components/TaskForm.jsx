import { useState } from "react";

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [titleError, setTitleError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (titleError) setTitleError("");
    if (submitError) setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError("Title is required");
      return;
    }

    setTitleError("");
    setSubmitError("");
    setIsSubmitting(true);

    const result = await onAdd({
      title: trimmedTitle,
      description: description.trim(),
      due_date: dueDate || null,
      priority,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || "Failed to add task. Please try again.");
      return;
    }

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2>Add Task</h2>

      {submitError && (
        <p className="form-error" role="alert">
          {submitError}
        </p>
      )}

      <div className="form-row">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="What needs to be done?"
          required
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? "title-error" : undefined}
          className={titleError ? "input-error" : ""}
          disabled={isSubmitting}
        />
        {titleError && (
          <p id="title-error" className="field-error" role="alert">
            {titleError}
          </p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-row">
        <label htmlFor="dueDate">Due date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-row">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={isSubmitting}
          className="form-select"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;
