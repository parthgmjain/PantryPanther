// src/components/RecipeList.jsx
import RecipeCard from './RecipeCard';
import useRecipes from '../hooks/useRecipes';
import useMatchedRecipes from '../hooks/useMatchedRecipes';

function RecipeList({ pantryIngredients = [], searchFilters = {} }) {
  const { recipes, loading, error } = useRecipes();
  const matchedRecipes = useMatchedRecipes(recipes, pantryIngredients, searchFilters);

  if (loading) {
    return (
      <div className="recipe-list-loading">
        <p>Loading recipes…</p>
      </div>
    );
  }

  if (error) {
    return <div className="recipe-list-error">Error loading recipes: {error.message}</div>;
  }

  if (matchedRecipes.length === 0 && pantryIngredients.length > 0) {
    return (
      <div className="recipe-list-empty">
        <p>No matching recipes found.</p>
        <small>Try adding more ingredients or adjusting your filters.</small>
      </div>
    );
  }

  if (pantryIngredients.length === 0 && matchedRecipes.length === 0) {
    return (
      <div className="recipe-list-empty">
        <p>Add ingredients to your pantry to see matching recipes.</p>
      </div>
    );
  }

  if (matchedRecipes.length === 0 && searchFilters.searchTerm) {
    return (
      <div className="recipe-list-empty">
        <p>No recipes found matching "{searchFilters.searchTerm}"</p>
        <small>Try a different search term or clear your filters.</small>
      </div>
    );
  }

  return (
    <section className="recipe-list" aria-labelledby="recipes-heading">
      <div className="recipe-list-header">
        <h3 id="recipes-heading">Recipes you can make ({matchedRecipes.length})</h3>
        <p className="match-info">Sorted by ingredient match</p>
      </div>
      <div className="recipe-grid">
        {matchedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            showMatchInfo={pantryIngredients.length > 0}
          />
        ))}
      </div>
    </section>
  );
}

export default RecipeList;
