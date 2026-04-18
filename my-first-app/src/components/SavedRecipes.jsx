// src/components/SavedRecipes.jsx
import { useState } from 'react';
import RecipeCard from './RecipeCard';
import { useSavedRecipes } from '../context/SavedRecipesContext';

function SavedRecipes() {
  const { savedRecipes, clearAllSaved } = useSavedRecipes();
  const [isExpanded, setIsExpanded] = useState(true);

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