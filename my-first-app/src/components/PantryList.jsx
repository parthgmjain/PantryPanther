// src/components/PantryList.jsx
import { useState, useEffect } from 'react';
import useIngredients from '../hooks/useIngredients';

function PantryList() {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { allIngredients, loading } = useIngredients();

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
      setIngredients([...ingredients, newIngredient]);
      setCurrentIngredient('');
      setSuggestions([]);
    }
  };

  const removeIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addIngredient(currentIngredient);
    }
  };

  return (
    <div className="pantry-list">
      <h2>My Pantry</h2>
      
      <div className="input-section">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={loading ? "Loading ingredients..." : "Type an ingredient (e.g., chicken, rice, tomatoes)"}
        />
        <button onClick={() => addIngredient(currentIngredient)}>
          Add Ingredient
        </button>
      </div>

      {/* Regular dropdown select instead of autocomplete */}
      {suggestions.length > 0 && (
        <div className="ingredient-suggestions">
          <p>Suggestions:</p>
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

      {ingredients.length === 0 ? (
        <p className="empty-message">No ingredients yet. Add what you have!</p>
      ) : (
        <div className="ingredients-list">
          <h3>Your Ingredients ({ingredients.length})</h3>
          <div className="ingredient-tags">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-tag">
                <span>{ingredient}</span>
                <button 
                  onClick={() => removeIngredient(index)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PantryList;