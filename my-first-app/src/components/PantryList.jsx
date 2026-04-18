// src/components/PantryList.jsx
import { useState, useEffect } from 'react';
import useIngredients from '../hooks/useIngredients';

function PantryList({ onUpdate }) {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { allIngredients, loading } = useIngredients();

  // Load saved ingredients from localStorage when component mounts
  useEffect(() => {
    const savedIngredients = localStorage.getItem('pantryIngredients');
    if (savedIngredients) {
      const parsedIngredients = JSON.parse(savedIngredients);
      setIngredients(parsedIngredients);
      // Notify parent of loaded ingredients
      if (onUpdate) {
        onUpdate(parsedIngredients);
      }
    }
  }, []); // Empty array means this runs once when component loads

  // Save ingredients to localStorage whenever they change
  useEffect(() => {
    if (ingredients.length > 0) {
      localStorage.setItem('pantryIngredients', JSON.stringify(ingredients));
    } else {
      // If pantry is empty, remove from localStorage
      localStorage.removeItem('pantryIngredients');
    }
    // Notify parent of the update
    if (onUpdate) {
      onUpdate(ingredients);
    }
  }, [ingredients]); // Runs every time ingredients change

  // Update suggestions based on current input
  useEffect(() => {
    if (currentIngredient.trim().length > 0 && allIngredients.length > 0) {
      const filtered = allIngredients
        .filter(ing => ing.includes(currentIngredient.toLowerCase().trim()))
        .slice(0, 10);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [currentIngredient, allIngredients]);

  const addIngredient = (ingredient) => {
    const newIngredient = ingredient.trim().toLowerCase();
    if (newIngredient !== '' && !ingredients.includes(newIngredient)) {
      const updatedIngredients = [...ingredients, newIngredient];
      setIngredients(updatedIngredients);
      setCurrentIngredient('');
      setSuggestions([]);
    }
  };

  const removeIngredient = (indexToRemove) => {
    const updatedIngredients = ingredients.filter((_, index) => index !== indexToRemove);
    setIngredients(updatedIngredients);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addIngredient(currentIngredient);
    }
  };

  const clearAllIngredients = () => {
    setIngredients([]);
    localStorage.removeItem('pantryIngredients');
  };

  return (
    <div className="pantry-list">
      <h2>📦 My Pantry</h2>
      <p className="pantry-subtitle">Add ingredients you have at home</p>
      
      <div className="input-section">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={loading ? "Loading ingredients..." : "Type an ingredient (e.g., chicken, rice, tomatoes)"}
          disabled={loading}
        />
        <button onClick={() => addIngredient(currentIngredient)} disabled={loading}>
          + Add
        </button>
      </div>

      {/* Suggestion buttons */}
      {suggestions.length > 0 && (
        <div className="ingredient-suggestions">
          <p>💡 Suggestions:</p>
          <div className="suggestion-buttons">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => addIngredient(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Display current pantry ingredients */}
      {ingredients.length === 0 ? (
        <div className="empty-pantry">
          <p>🍽️ Your pantry is empty</p>
          <small>Add ingredients to see matching recipes!</small>
        </div>
      ) : (
        <div className="ingredients-list">
          <h3>Your Ingredients ({ingredients.length})</h3>
          <div className="ingredient-tags">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-tag">
                <span>🥕 {ingredient}</span>
                <button 
                  onClick={() => removeIngredient(index)}
                  className="remove-btn"
                  title="Remove ingredient"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button 
            className="clear-all-btn"
            onClick={clearAllIngredients}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

export default PantryList;