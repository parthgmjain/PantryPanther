// src/hooks/useRecipes.js
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/recipes.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load recipes.csv');
        }
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Parse each recipe to extract ingredients as an array
            const parsedRecipes = results.data.map((recipe, index) => {
              let ingredientsArray = [];
              
              if (recipe.ingredients) {
                // Split by commas, but be careful with parentheses
                ingredientsArray = recipe.ingredients
                  .split(/,(?![^(]*\))/)
                  .flatMap(part => part.split(/\s+and\s+/i))
                  .map(ingredient => {
                    // Clean up each ingredient
                    return ingredient
                      .trim()
                      .toLowerCase()
                      .replace(/^\d+(?:\.\d+)?\s*(?:cup|cups|tablespoon|tablespoons|tbsp|teaspoon|teaspoons|tsp|ounce|ounces|oz|pound|pounds|lb|lbs|gram|grams|g|kilogram|kilograms|kg|pinch|dash|to taste)?\s*/i, '')
                      .replace(/^[^a-z]+/i, '')
                      .replace(/^(?:of|a|an|the|some|fresh|dried|ground|whole|chopped|minced|grated|sliced|diced|mashed|melted|softened)\s+/i, '')
                      .trim();
                  })
                  .filter(ing => ing.length > 2 && !ing.includes('step') && !ing.includes('instruction'));
              }
              
              return {
                id: index,
                name: recipe.recipe_name || 'Unknown Recipe',
                ingredients: ingredientsArray,
                prepTime: recipe.prep_time,
                cookTime: recipe.cook_time,
                totalTime: recipe.total_time,
                yield: recipe.yield || recipe.servings || 'N/A',
                rating: parseFloat(recipe.rating) || 0,
                url: recipe.url || null,
                imgSrc: recipe.img_src || null
              };
            });
            
            console.log(`Loaded ${parsedRecipes.length} recipes with ingredients`);
            setRecipes(parsedRecipes);
            setLoading(false);
          },
          error: (err) => {
            setError(err);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { recipes, loading, error };
}

export default useRecipes;