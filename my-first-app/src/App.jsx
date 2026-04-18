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

  return (
    <div className="App">
      <header className="app-header">
        <h1>🍳 PantryPanther</h1>
        <p>Find recipes based on what you have!</p>
      </header>
      
      <main className="app-main">
        <PantryList onUpdate={handlePantryUpdate} />
        
        {/* Saved Recipes Section - appears above search */}
        <SavedRecipes />
        
        <RecipeSearch onSearch={handleSearch} />
        
        {(searchFilters.searchTerm || searchFilters.maxTime || searchFilters.minRating) && (
          <div className="active-filters">
            <h4>Active Filters:</h4>
            <div className="filter-tags">
              {searchFilters.searchTerm && (
                <span className="filter-tag">🔍 {searchFilters.searchTerm}</span>
              )}
              {searchFilters.maxTime && (
                <span className="filter-tag">⏱️ Under {searchFilters.maxTime} min</span>
              )}
              {searchFilters.minRating && (
                <span className="filter-tag">⭐ {searchFilters.minRating}+ stars</span>
              )}
            </div>
          </div>
        )}
        
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