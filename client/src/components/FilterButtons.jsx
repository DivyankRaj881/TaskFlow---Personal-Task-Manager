const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

function FilterButtons({ activeFilter, onChange }) {
  return (
    <div className="filter-buttons" role="group" aria-label="Filter tasks">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`btn filter-btn ${activeFilter === filter.id ? "active" : ""}`}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
