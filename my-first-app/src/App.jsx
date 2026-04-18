// src/App.jsx
import './App.css'
import PantryList from './components/PantryList'
import './components/PantryList.css'  // Import the styles

function App() {
  return (
    <div className="App">
      <h1>PantryPanther</h1>
      <p>Find recipes based on what you have!</p>
      <PantryList />
    </div>
  )
}

export default App