// src/hooks/useMatchedRecipes.js
import { useState, useEffect } from 'react';

function useMatchedRecipes(recipes, pantryIngredients, searchFilters = {}) {
  const [matchedRecipes, setMatchedRecipes] = useState([]);

  useEffect(() => {
    if (!recipes.length) {
      setMatchedRecipes([]);
      return;
    }

    // Helper function to parse time strings to minutes
    const parseTimeToMinutes = (timeString) => {
      if (!timeString || timeString === '') return 0;
      
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
      
      return totalMinutes || 0;
    };

    // First, calculate match score for each recipe based on pantry ingredients
    let recipesWithScores = recipes.map(recipe => {
      // Count how many pantry ingredients match recipe ingredients
      let matchedCount = 0;
      const missingIngredients = [];
      
      if (pantryIngredients.length > 0) {
        recipe.ingredients.forEach(recipeIngredient => {
          const isMatched = pantryIngredients.some(pantryIng => 
            recipeIngredient.includes(pantryIng) || pantryIng.includes(recipeIngredient)
          );
          
          if (isMatched) {
            matchedCount++;
          } else {
            if (recipeIngredient.length > 3) {
              missingIngredients.push(recipeIngredient);
            }
          }
        });
      }
      
      const matchPercentage = recipe.ingredients.length > 0 
        ? (matchedCount / recipe.ingredients.length) * 100 
        : 0;
      
      return {
        ...recipe,
        matchedCount,
        totalIngredients: recipe.ingredients.length,
        matchPercentage,
        missingIngredients: missingIngredients.slice(0, 5)
      };
    });

    // Apply search filters
    let filteredRecipes = recipesWithScores;

    // Filter by search term (recipe name)
    if (searchFilters.searchTerm && searchFilters.searchTerm !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchFilters.searchTerm)
      );
    }

    // Filter by max time
    if (searchFilters.maxTime && searchFilters.maxTime > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const totalMinutes = parseTimeToMinutes(recipe.totalTime);
        return totalMinutes <= searchFilters.maxTime && totalMinutes > 0;
      });
    }

    // Filter by minimum rating
    if (searchFilters.minRating && searchFilters.minRating > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.rating >= searchFilters.minRating
      );
    }

    // Sort by match percentage (highest first)
    const sorted = filteredRecipes
      .filter(recipe => {
        // If no pantry ingredients, show all recipes (but still apply search filters)
        if (pantryIngredients.length === 0) return true;
        // Otherwise only show recipes with at least 1 match
        return recipe.matchPercentage > 0;
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    setMatchedRecipes(sorted);
  }, [recipes, pantryIngredients, searchFilters]);

  return matchedRecipes;
}

export default useMatchedRecipes;