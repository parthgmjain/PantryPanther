// src/App.jsx
import { useState } from 'react';
import './App.css';
import PantryList from './components/PantryList';
import RecipeSearch from './components/RecipeSearch';
import RecipeList from './components/RecipeList';
import './components/PantryList.css';
import './components/RecipeSearch.css';
import './components/RecipeCard.css';
import './components/RecipeList.css';

function App() {
  const [pantryIngredients, setPantryIngredients] = useState([]);

  // This function will be called from PantryList when ingredients change
  const handlePantryUpdate = (ingredients) => {
    setPantryIngredients(ingredients);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🍳 PantryPanther</h1>
        <p>Find recipes based on what you have!</p>
      </header>
      
      <main className="app-main">
        <PantryList onUpdate={handlePantryUpdate} />
        <RecipeSearch />
        <RecipeList pantryIngredients={pantryIngredients} />
      </main>
    </div>
  );
}

export default App;