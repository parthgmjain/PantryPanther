// src/context/SavedRecipesContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

const SavedRecipesContext = createContext();

export function SavedRecipesProvider({ children }) {
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Load saved recipes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedRecipes');
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever savedRecipes changes
  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const saveRecipe = (recipe) => {
    // Check if recipe is already saved
    if (!savedRecipes.some(r => r.id === recipe.id)) {
      setSavedRecipes([...savedRecipes, recipe]);
      return true;
    }
    return false;
  };

  const unsaveRecipe = (recipeId) => {
    setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== recipeId));
  };

  const isSaved = (recipeId) => {
    return savedRecipes.some(recipe => recipe.id === recipeId);
  };

  const clearAllSaved = () => {
    setSavedRecipes([]);
  };

  return (
    <SavedRecipesContext.Provider value={{
      savedRecipes,
      saveRecipe,
      unsaveRecipe,
      isSaved,
      clearAllSaved
    }}>
      {children}
    </SavedRecipesContext.Provider>
  );
}

export function useSavedRecipes() {
  return useContext(SavedRecipesContext);
}