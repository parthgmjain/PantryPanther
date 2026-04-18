// src/components/SavedRecipes.jsx
import { useState } from 'react';
import RecipeCard from './RecipeCard';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import useRecipes from '../hooks/useRecipes';

function SavedRecipes() {
  const { savedRecipeIds, clearAllSaved } = useSavedRecipes();
  const { recipes, loading } = useRecipes();
  const [isExpanded, setIsExpanded] = useState(true);

  // Get full recipe objects from saved IDs
  const savedRecipes = recipes.filter(recipe => savedRecipeIds.includes(recipe.id));

  if (loading) {
    return (
      <div className="saved-recipes">
        <div className="saved-recipes-header">
          <h3>❤️ Saved Recipes</h3>
          <button className="toggle-btn">▼</button>
        </div>
        <div className="saved-recipes-loading">
          <p>Loading saved recipes...</p>
        </div>
      </div>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <div className="saved-recipes">
        <div className="saved-recipes-header" onClick={() => setIsExpanded(!isExpanded)}>
          <h3>❤️ Saved Recipes (0)</h3>
          <button className="toggle-btn">{isExpanded ? '▼' : '▶'}</button>
        </div>
        {isExpanded && (
          <div className="saved-recipes-empty">
            <p>No saved recipes yet.</p>
            <small>Click the ♡ button on any recipe to save it here!</small>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="saved-recipes">
      <div className="saved-recipes-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>❤️ Saved Recipes ({savedRecipes.length})</h3>
        <div className="saved-header-actions">
          {savedRecipes.length > 0 && (
            <button 
              className="clear-saved-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Clear all saved recipes?')) {
                  clearAllSaved();
                }
              }}
            >
              Clear All
            </button>
          )}
          <button className="toggle-btn">{isExpanded ? '▼' : '▶'}</button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="saved-recipes-content">
          <div className="recipe-grid">
            {savedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} showMatchInfo={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedRecipes;