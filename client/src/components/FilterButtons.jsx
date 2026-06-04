const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

function FilterButtons({ activeFilter, onChange, counts = {} }) {
  return (
    <div className="filter-buttons" role="group" aria-label="Filter tasks">
      {FILTERS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`btn filter-btn ${activeFilter === id ? "active" : ""}`}
          aria-pressed={activeFilter === id}
          onClick={() => onChange(id)}
        >
          {label}
          {counts[id] !== undefined && (
            <span className="filter-count">{counts[id]}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
