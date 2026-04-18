// src/components/RecipeCard.jsx
function RecipeCard({ recipe, showMatchInfo = false }) {
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

  const handleCardClick = () => {
    if (recipe.url) {
      window.open(recipe.url, '_blank');
    } else {
      const searchQuery = encodeURIComponent(`${recipe.name} recipe`);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
    }
  };

  // Get match percentage color
  const getMatchColor = (percentage) => {
    if (percentage >= 80) return '#22c55e'; // Green - great match
    if (percentage >= 50) return '#f59e0b'; // Orange - decent match
    return '#ef4444'; // Red - poor match
  };

  return (
    <div className="recipe-card" onClick={handleCardClick}>
      <h3>{recipe.name}</h3>
      
      {showMatchInfo && recipe.matchPercentage && (
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
            <span>🍳 {Math.round(recipe.matchPercentage)}% match</span>
            <span>({recipe.matchedCount}/{recipe.totalIngredients} ingredients)</span>
          </div>
          {recipe.missingIngredients.length > 0 && (
            <div className="missing-ingredients">
              <small>Missing: {recipe.missingIngredients.slice(0, 3).join(', ')}</small>
              {recipe.missingIngredients.length > 3 && (
                <small> +{recipe.missingIngredients.length - 3} more</small>
              )}
            </div>
          )}
        </div>
      )}
      
      <p>⏱️ Prep: {formatTime(recipe.prepTime)}</p>
      <p>🔥 Cook: {formatTime(recipe.cookTime)}</p>
      <p>🍽️ Yield: {recipe.yield}</p>
      {recipe.rating > 0 && <p>⭐ Rating: {recipe.rating}</p>}
      <small>🔗 Click to view recipe →</small>
    </div>
  );
}

export default RecipeCard;