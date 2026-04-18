// src/components/RecipeList.jsx
import RecipeCard from './RecipeCard';
import useRecipes from '../hooks/useRecipes';
import useMatchedRecipes from '../hooks/useMatchedRecipes';

function RecipeList({ pantryIngredients = [] }) {
  const { recipes, loading, error } = useRecipes();
  const matchedRecipes = useMatchedRecipes(recipes, pantryIngredients);

  if (loading) {
    return <div className="recipe-list-loading">Loading recipes...</div>;
  }

  if (error) {
    return <div className="recipe-list-error">Error loading recipes: {error.message}</div>;
  }

  if (matchedRecipes.length === 0 && pantryIngredients.length > 0) {
    return (
      <div className="recipe-list-empty">
        <p>🍽️ No matching recipes found. Try adding more ingredients to your pantry!</p>
      </div>
    );
  }

  if (pantryIngredients.length === 0) {
    return (
      <div className="recipe-list-empty">
        <p>📝 Add ingredients to your pantry to see matching recipes!</p>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <div className="recipe-list-header">
        <h3>📖 Recipes You Can Make ({matchedRecipes.length})</h3>
        <p className="match-info">Sorted by ingredient match percentage</p>
      </div>
      <div className="recipe-grid">
        {matchedRecipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe}
            showMatchInfo={true}
          />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;