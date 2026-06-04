function TaskStats({ activeCount, completedCount }) {
  return (
    <div className="task-stats" aria-live="polite" aria-label="Task statistics">
      <div className="stat-card stat-active">
        <span className="stat-value">{activeCount}</span>
        <span className="stat-label">Active Tasks</span>
      </div>
      <div className="stat-card stat-completed">
        <span className="stat-value">{completedCount}</span>
        <span className="stat-label">Completed Tasks</span>
      </div>
    </div>
  );
}

export default TaskStats;
