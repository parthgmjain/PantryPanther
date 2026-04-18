// src/hooks/useMatchedRecipes.js
import { useState, useEffect } from 'react';

function useMatchedRecipes(recipes, pantryIngredients) {
  const [matchedRecipes, setMatchedRecipes] = useState([]);

  useEffect(() => {
    if (!recipes.length || !pantryIngredients.length) {
      setMatchedRecipes([]);
      return;
    }

    // Calculate match score for each recipe
    const recipesWithScores = recipes.map(recipe => {
      // Count how many pantry ingredients match recipe ingredients
      let matchedCount = 0;
      const missingIngredients = [];
      
      recipe.ingredients.forEach(recipeIngredient => {
        // Check if any pantry ingredient is contained within the recipe ingredient
        const isMatched = pantryIngredients.some(pantryIng => 
          recipeIngredient.includes(pantryIng) || pantryIng.includes(recipeIngredient)
        );
        
        if (isMatched) {
          matchedCount++;
        } else {
          // Only track missing if it's a meaningful ingredient (not too short)
          if (recipeIngredient.length > 3) {
            missingIngredients.push(recipeIngredient);
          }
        }
      });
      
      // Calculate match percentage
      const matchPercentage = recipe.ingredients.length > 0 
        ? (matchedCount / recipe.ingredients.length) * 100 
        : 0;
      
      return {
        ...recipe,
        matchedCount,
        totalIngredients: recipe.ingredients.length,
        matchPercentage,
        missingIngredients: missingIngredients.slice(0, 5) // Show top 5 missing
      };
    });
    
    // Sort by match percentage (highest first)
    const sorted = recipesWithScores
      .filter(recipe => recipe.matchPercentage > 0) // Only show recipes with at least 1 match
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    setMatchedRecipes(sorted);
  }, [recipes, pantryIngredients]);

  return matchedRecipes;
}

export default useMatchedRecipes;