// src/App.jsx
import { useState } from 'react';
import './App.css';
import { SavedRecipesProvider } from './context/SavedRecipesContext';
import PantryList from './components/PantryList';
import RecipeSearch from './components/RecipeSearch';
import RecipeList from './components/RecipeList';
import SavedRecipes from './components/SavedRecipes';
import './components/PantryList.css';
import './components/RecipeSearch.css';
import './components/RecipeCard.css';
import './components/RecipeList.css';
import './components/SavedRecipes.css';

function AppContent() {
  const [pantryIngredients, setPantryIngredients] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    maxTime: null,
    minRating: null
  });

  const handlePantryUpdate = (ingredients) => {
    setPantryIngredients(ingredients);
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  const hasActiveFilters = searchFilters.searchTerm || searchFilters.maxTime || searchFilters.minRating;

  return (
    <div className="App">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span className="brand-name">PantryPanther</span>
        </div>
        <span className="brand-scope">Your kitchen</span>
      </header>

      <main className="app-main">
        <div className="app-intro">
          <h1>What can you cook tonight?</h1>
          <p>Add what's in your kitchen and we'll find the recipes you can make.</p>
        </div>

        <PantryList onUpdate={handlePantryUpdate} />
        <RecipeSearch onSearch={handleSearch} />

        {hasActiveFilters && (
          <div className="active-filters">
            <h4>Active filters</h4>
            <div className="filter-tags">
              {searchFilters.searchTerm && (
                <span className="filter-tag">Name: {searchFilters.searchTerm}</span>
              )}
              {searchFilters.maxTime && (
                <span className="filter-tag">Under {searchFilters.maxTime} min</span>
              )}
              {searchFilters.minRating && (
                <span className="filter-tag">{searchFilters.minRating}+ stars</span>
              )}
            </div>
          </div>
        )}

        <SavedRecipes />

        <RecipeList
          pantryIngredients={pantryIngredients}
          searchFilters={searchFilters}
        />
      </main>
    </div>
  );
}

function App() {
  return (
    <SavedRecipesProvider>
      <AppContent />
    </SavedRecipesProvider>
  );
}

export default App;
