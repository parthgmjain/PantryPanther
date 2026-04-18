// src/App.jsx
import './App.css';
import PantryList from './components/PantryList';
import RecipeSearch from './components/RecipeSearch';
import RecipeList from './components/RecipeList';
import './components/PantryList.css';
import './components/RecipeSearch.css';
import './components/RecipeCard.css';
import './components/RecipeList.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🍳 PantryPanther</h1>
        <p>Find recipes based on what you have!</p>
      </header>
      
      <main className="app-main">
        <PantryList />
        <RecipeSearch />
        <RecipeList />
      </main>
    </div>
  );
}

export default App;