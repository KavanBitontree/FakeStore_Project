import { useState, useEffect } from "react";
import "./Search.scss";
import SearchIcon from "./SearchIcon";

const Search = ({ onSearch, placeholder = "Search products..." }) => {
  const [value, setValue] = useState("");

  // 🔁 Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(value.trim());
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  const handleClear = () => {
    setValue("");
    onSearch?.("");
  };

  return (
    <div className="search">
      <span className="search-icon">
        <SearchIcon />
      </span>

      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {value && (
        <button
          className="clear-btn"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Search;
