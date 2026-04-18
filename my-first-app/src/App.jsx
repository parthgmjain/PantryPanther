// src/App.jsx
import './App.css'
import PantryList from './components/PantryList'
import './components/PantryList.css' 

import RecipeSearch from './components/RecipeSearch'
import './components/RecipeSearch.css' 

function App() {
  return (
    <div className="App">
      <h1>PantryPanther</h1>
      <p>Find recipes based on what you have!</p>
      <PantryList />
      <RecipeSearch />
    </div>
  )
}

export default App