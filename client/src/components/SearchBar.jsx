function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar" role="search">
      <label htmlFor="search" className="visually-hidden">
        Search tasks by title
      </label>
      <input
        id="search"
        type="search"
        placeholder="Search by title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}

export default SearchBar;
