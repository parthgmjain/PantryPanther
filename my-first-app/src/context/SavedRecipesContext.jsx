// src/context/SavedRecipesContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from 'react';

const SavedRecipesContext = createContext();

export function SavedRecipesProvider({ children }) {
  // Initialize with empty array, then load from localStorage after mount
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved recipe IDs from localStorage on mount (only once)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedRecipeIds');
      console.log('Raw from localStorage:', saved);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Parsed saved recipe IDs:', parsed);
        setSavedRecipeIds(parsed);
      } else {
        console.log('No saved recipes found in localStorage');
        setSavedRecipeIds([]);
      }
    } catch (error) {
      console.error('Error loading saved recipes:', error);
      setSavedRecipeIds([]);
    } finally {
      setIsInitialized(true);
    }
  }, []); // Empty array = run once on mount

  // Save to localStorage whenever savedRecipeIds changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      console.log('Saving to localStorage:', savedRecipeIds);
      localStorage.setItem('savedRecipeIds', JSON.stringify(savedRecipeIds));
    }
  }, [savedRecipeIds, isInitialized]);

  const saveRecipe = useCallback((recipeId) => {
    setSavedRecipeIds(prev => {
      if (!prev.includes(recipeId)) {
        const newIds = [...prev, recipeId];
        console.log('Adding recipe ID:', recipeId, 'New list:', newIds);
        return newIds;
      }
      return prev;
    });
  }, []);

  const unsaveRecipe = useCallback((recipeId) => {
    setSavedRecipeIds(prev => {
      const newIds = prev.filter(id => id !== recipeId);
      console.log('Removing recipe ID:', recipeId, 'New list:', newIds);
      return newIds;
    });
  }, []);

  const isSaved = useCallback((recipeId) => {
    return savedRecipeIds.includes(recipeId);
  }, [savedRecipeIds]);

  const clearAllSaved = useCallback(() => {
    console.log('Clearing all saved recipes');
    setSavedRecipeIds([]);
  }, []);

  return (
    <SavedRecipesContext.Provider value={{
      savedRecipeIds,
      saveRecipe,
      unsaveRecipe,
      isSaved,
      clearAllSaved,
      isInitialized
    }}>
      {children}
    </SavedRecipesContext.Provider>
  );
}

export function useSavedRecipes() {
  const context = useContext(SavedRecipesContext);
  if (!context) {
    throw new Error('useSavedRecipes must be used within a SavedRecipesProvider');
  }
  return context;
}