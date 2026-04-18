// src/hooks/useIngredients.js
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

function useIngredients() {
  const [allIngredients, setAllIngredients] = useState([]);
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
            // Extract all ingredients from each recipe
            const ingredientsSet = new Set();
            
            results.data.forEach(recipe => {
              if (recipe.ingredients) {
                // Split ingredients by common separators (commas, and, etc.)
                const ingredientList = recipe.ingredients
                  .split(/,(?![^(]*\))/) // Split by comma not inside parentheses
                  .flatMap(part => part.split(/\s+and\s+/i)); // Split by "and"
                
                ingredientList.forEach(ingredient => {
                  // Clean up the ingredient text
                  let cleanIngredient = ingredient
                    .trim()
                    .toLowerCase()
                    // Remove quantities (numbers and common units)
                    .replace(/^\d+(?:\.\d+)?\s*(?:cup|cups|tablespoon|tablespoons|tbsp|teaspoon|teaspoons|tsp|ounce|ounces|oz|pound|pounds|lb|lbs|gram|grams|g|kilogram|kilograms|kg|pinch|dash|to taste)?\s*/i, '')
                    .replace(/^[^a-z]+/i, '') // Remove leading non-letters
                    .trim();
                  
                  // Remove common filler words at start
                  const fillerWords = /^(?:of|a|an|the|some|fresh|dried|ground|whole|chopped|minced|grated|sliced|diced|mashed|melted|softened)\s+/i;
                  cleanIngredient = cleanIngredient.replace(fillerWords, '');
                  
                  // Only add if not empty and longer than 2 characters
                  if (cleanIngredient.length > 2 && !cleanIngredient.includes('step') && !cleanIngredient.includes('instruction')) {
                    ingredientsSet.add(cleanIngredient);
                  }
                });
              }
            });
            
            // Convert set to sorted array
            const ingredientsList = Array.from(ingredientsSet).sort();
            console.log(`Loaded ${ingredientsList.length} unique ingredients`);
            setAllIngredients(ingredientsList);
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

  return { allIngredients, loading, error };
}

export default useIngredients;