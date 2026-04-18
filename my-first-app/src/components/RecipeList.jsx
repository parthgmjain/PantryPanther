// src/components/RecipeList.jsx
import RecipeCard from './RecipeCard';

// STATIC PRESET RECIPES - no changes needed, just for testing
const RECIPES = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    prepTime: 10,
    cookTime: 20,
    yield: "4 servings",
    rating: 4.8,
    url: "https://www.allrecipes.com/recipe/11973/spaghetti-carbonara/"
  },
  {
    id: 2,
    name: "Chicken Stir Fry",
    prepTime: 15,
    cookTime: 10,
    yield: "2 servings",
    rating: 4.5,
    url: "https://www.recipetineats.com/chicken-stir-fry/"
  },
  {
    id: 3,
    name: "Vegetable Curry",
    prepTime: 20,
    cookTime: 25,
    yield: "4 servings",
    rating: 4.7,
    url: "https://www.bbcgoodfood.com/recipes/thai-vegetable-curry"
  },
  {
    id: 4,
    name: "Avocado Toast",
    prepTime: 5,
    cookTime: 0,
    yield: "1 serving",
    rating: 4.3,
    url: "https://www.loveandlemons.com/avocado-toast/"
  },
  {
    id: 5,
    name: "Beef Stew",
    prepTime: 20,
    cookTime: 120,
    yield: "6 servings",
    rating: 4.9,
    url: "https://www.simplyrecipes.com/recipes/beef_stew/"
  }
];

function RecipeList() {
  return (
    <div className="recipe-list">
      <h3>📖 Recipes ({RECIPES.length})</h3>
      <div className="recipe-grid">
        {RECIPES.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;