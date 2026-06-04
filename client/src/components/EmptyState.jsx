function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-message">{message}</p>
    </div>
  );
}

export default EmptyState;
