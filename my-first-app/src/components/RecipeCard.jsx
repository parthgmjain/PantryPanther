// src/components/RecipeCard.jsx
import { useSavedRecipes } from '../context/SavedRecipesContext';

function RecipeCard({ recipe, showMatchInfo = false }) {
  const { saveRecipe, unsaveRecipe, isSaved } = useSavedRecipes();
  const saved = isSaved(recipe.id);

  const formatTime = (timeString) => {
    if (!timeString || timeString === '') return 'N/A';

    const str = String(timeString).toLowerCase();
    let totalMinutes = 0;

    const hoursMatch = str.match(/(\d+(?:\.\d+)?)\s*hrs?/);
    if (hoursMatch) {
      totalMinutes += parseFloat(hoursMatch[1]) * 60;
    }

    const minsMatch = str.match(/(\d+(?:\.\d+)?)\s*mins?/);
    if (minsMatch) {
      totalMinutes += parseFloat(minsMatch[1]);
    }

    if (totalMinutes === 0) return 'N/A';
    if (totalMinutes < 60) return `${totalMinutes} min`;
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const openRecipe = () => {
    if (recipe.url) {
      window.open(recipe.url, '_blank');
    } else {
      const searchQuery = encodeURIComponent(`${recipe.name} recipe`);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
    }
  };

  const handleCardClick = (e) => {
    // Don't trigger if clicking the save button
    if (e.target.closest('.save-recipe-btn')) return;
    openRecipe();
  };

  const handleCardKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter') {
      openRecipe();
    }
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (saved) {
      unsaveRecipe(recipe.id);
    } else {
      saveRecipe(recipe.id);
    }
  };

  // Match colour is data: the accent when at least half the recipe is in the pantry, muted otherwise
  const getMatchColor = (percentage) => (percentage >= 50 ? 'var(--herb)' : 'var(--muted)');

  return (
    <div
      className="recipe-card"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
    >
      <div className="recipe-card-header">
        <h3>{recipe.name}</h3>
        <button
          className={`save-recipe-btn ${saved ? 'saved' : ''}`}
          onClick={handleSaveClick}
          title={saved ? 'Remove from saved' : 'Save recipe'}
          aria-label={saved ? 'Remove from saved' : 'Save recipe'}
          aria-pressed={saved}
        >
          <svg
            viewBox="0 0 24 24"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 21s-7-4.35-9.5-8.5C.9 9.4 2.6 5.5 6.4 5.1 8.6 4.9 10.6 6 12 7.8 13.4 6 15.4 4.9 17.6 5.1c3.8.4 5.5 4.3 3.9 7.4C19 16.65 12 21 12 21z" />
          </svg>
        </button>
      </div>

      {showMatchInfo && recipe.matchPercentage !== undefined && (
        <div className="match-indicator">
          <div className="match-bar">
            <div
              className="match-fill"
              style={{
                width: `${recipe.matchPercentage}%`,
                backgroundColor: getMatchColor(recipe.matchPercentage)
              }}
            />
          </div>
          <div className="match-text">
            <span>{Math.round(recipe.matchPercentage)}% match</span>
            <span>({recipe.matchedCount}/{recipe.totalIngredients} ingredients)</span>
          </div>
          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <div className="missing-ingredients">
              <small>Missing: {recipe.missingIngredients.slice(0, 3).join(', ')}</small>
              {recipe.missingIngredients.length > 3 && (
                <small> +{recipe.missingIngredients.length - 3} more</small>
              )}
            </div>
          )}
        </div>
      )}

      <p>Prep: {formatTime(recipe.prepTime)}</p>
      <p>Cook: {formatTime(recipe.cookTime)}</p>
      <p>Yield: {recipe.yield}</p>
      {recipe.rating > 0 && <p>Rating: {recipe.rating}</p>}
      <small>Open recipe →</small>
    </div>
  );
}

export default RecipeCard;
