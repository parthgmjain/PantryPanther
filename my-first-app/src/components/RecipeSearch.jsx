// src/components/RecipeSearch.jsx
import { useState } from 'react';

function RecipeSearch() {
  // State for search inputs
  const [searchTerm, setSearchTerm] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [minRating, setMinRating] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle search form submission
  const handleSearch = () => {
    const filters = {
      searchTerm: searchTerm.trim().toLowerCase(),
      maxTime: maxTime ? parseInt(maxTime) : null,
      minRating: minRating ? parseFloat(minRating) : null
    };
    
    // Pass filters up to parent component
    onSearch(filters);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setMaxTime('');
    setMinRating('');
    onSearch({
      searchTerm: '',
      maxTime: null,
      minRating: null
    });
  };

  // Handle Enter key press on any input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="recipe-search">
      <div className="search-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>🔍 Search & Filter Recipes</h3>
        <button className="toggle-btn">{isExpanded ? '▼' : '▶'}</button>
      </div>

      {isExpanded && (
        <div className="search-filters">
          {/* Search by Recipe Name */}
          <div className="filter-group">
            <label>Recipe Name:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., pasta, chicken soup, chocolate cake"
            />
          </div>

          {/* Filter by Total Time */}
          <div className="filter-group">
            <label>Max Total Time:</label>
            <div className="time-input">
              <input
                type="number"
                value={maxTime}
                onChange={(e) => setMaxTime(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Minutes"
                min="0"
                step="5"
              />
              <span className="time-unit">minutes</span>
            </div>
          </div>

          {/* Filter by Rating */}
          <div className="filter-group">
            <label>Minimum Rating:</label>
            <div className="rating-input">
              <input
                type="number"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Rating"
                min="0"
                max="5"
                step="0.5"
              />
              <span className="rating-stars">
                {minRating && `⭐ ${minRating}+ stars`}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="search-actions">
            <button onClick={handleSearch} className="search-btn">
              🔍 Search Recipes
            </button>
            <button onClick={clearFilters} className="clear-btn">
              ✕ Clear All
            </button>
          </div>

          {/* Quick filter suggestions */}
          <div className="quick-suggestions">
            <span className="suggestion-label">Quick filters:</span>
            <button onClick={() => { setMaxTime('15'); handleSearch(); }} className="suggestion-btn">
              ⏱️ Under 15 min
            </button>
            <button onClick={() => { setMinRating('4'); handleSearch(); }} className="suggestion-btn">
              ⭐ 4+ stars
            </button>
            <button onClick={() => { setSearchTerm('chicken'); handleSearch(); }} className="suggestion-btn">
              🍗 Chicken recipes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeSearch;