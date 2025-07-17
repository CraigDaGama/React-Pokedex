import React, { useState, useEffect } from 'react';
import '../styles/searchbar.css';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const types = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

function SearchBar({ searchTerm, setSearchTerm, filters, setFilters }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.body.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const toggleType = type => {
    const updated = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    setFilters({ ...filters, types: updated });
  };

  const removeType = type => {
    const updated = filters.types.filter(t => t !== type);
    setFilters({ ...filters, types: updated });
  };

  return (
    <div className={`search-bar-container ${darkMode ? 'dark' : ''}`}>
      <div className={`search-bar ${darkMode ? 'dark' : ''}`}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search Pokémon…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="selected-types-inline">
          {filters.types.map(type => (
            <span key={type} className={`pill type-${type}`}>
              {type}
              <button onClick={() => removeType(type)}>
                <FaTimes size={10} />
              </button>
            </span>
          ))}
          {filters.mega && (
            <span className="pill type-mega">
              Mega
              <button onClick={() => setFilters({ ...filters, mega: false })}>
                <FaTimes size={10} />
              </button>
            </span>
          )}
        </div>

        <button className="filter-button" onClick={() => setFiltersOpen(p => !p)}>
          <FaFilter />
        </button>
      </div>

      {filtersOpen && (
        <div className={`filters-popup ${darkMode ? 'dark' : ''}`}>
          <div className="types-list">
            {types.map(type => (
              <button
                key={type}
                className={`type-button type-${type} ${filters.types.includes(type) ? 'selected' : ''}`}
                onClick={() => toggleType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
            <button
              className={`type-mega ${filters.mega ? 'selected' : ''}`}
              onClick={() => setFilters({ ...filters, mega: !filters.mega })}
            >
              Mega
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
