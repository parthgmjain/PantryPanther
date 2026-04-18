// src/components/RecipeCard.jsx
function RecipeCard({ recipe }) {
  const formatTime = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
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

  return (
    <div className="recipe-card" onClick={handleCardClick}>
      <h3>{recipe.name}</h3>
      <p>⏱️ Prep Time: {formatTime(recipe.prepTime)}</p>
      <p>🔥 Cook Time: {formatTime(recipe.cookTime)}</p>
      <p>🍽️ Yield: {recipe.yield}</p>
      {recipe.rating && <p>⭐ Rating: {recipe.rating}</p>}
      <small>🔗 Click to view recipe →</small>
    </div>
  );
}

export default RecipeCard;