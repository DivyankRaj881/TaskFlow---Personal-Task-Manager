function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <label htmlFor="search" className="visually-hidden">
        Search tasks
      </label>
      <input
        id="search"
        type="search"
        placeholder="Search by title or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
