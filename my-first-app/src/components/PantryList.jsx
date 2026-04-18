// src/components/PantryList.jsx
import { useState } from 'react';

function PantryList() {
  // State to store the list of ingredients
  const [ingredients, setIngredients] = useState([]);
  
  // State for the current input value
  const [currentIngredient, setCurrentIngredient] = useState('');

  // Add an ingredient to the list
  const addIngredient = () => {
    if (currentIngredient.trim() !== '') {
      setIngredients([...ingredients, currentIngredient.trim().toLowerCase()]);
      setCurrentIngredient(''); // Clear the input
    }
  };

  // Remove an ingredient from the list
  const removeIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <div className="pantry-list">
      <h2>My Pantry</h2>
      
      {/* Input section */}
      <div className="input-section">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter an ingredient (e.g., chicken, rice, tomatoes)"
        />
        <button onClick={addIngredient}>Add Ingredient</button>
      </div>

      {/* Display the list of ingredients */}
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