// src/hooks/useIngredients.js
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Turns a raw recipe ingredient phrase (e.g. "1/4-inch thick sliced apples (peeled)")
// into a short pantry-style name (e.g. "apples"). Returns '' if nothing usable is left.
const LEADING_QTY = /^(?:[\d\s/.\-–]|to\b)+/;
const UNIT_WORDS =/^(?:cups?|tablespoons?|tbsps?|teaspoons?|tsps?|ounces?|oz|pounds?|lbs?|grams?|g|kilograms?|kg|pinch|dash|cans?|packages?|sheets?|cloves?|large|medium|small)\b\.?\s*/;
const DESCRIPTOR_CUTOFF = /,|;|\s[-–—]\s|\s+(?:cut|thick|inch|inches|thawed|softened|melted|room temperature|at room|for|or|such as|plus|to taste|divided|optional|about)\b/;
const FILLER_WORDS = /^(?:of|a|an|the|some|fresh|dried|ground|whole|chopped|minced|grated|sliced|diced|mashed|melted|softened|lightly|beaten|about|bite-size|bite-sized|chunks?|pieces?)\s+/;
const NOT_AN_INGREDIENT = /^(?:inch|inches|thick|taste|blanched|chunks?|pieces?|cut|sliced|diced|minced|optional|divided|needed|more|less|total|plus|extra)$/;

function cleanIngredientName(raw) {
  let s = raw
    .toLowerCase()
    .replace(/\([^)]*\)?/g, ' ')           // drop parenthetical notes, incl. unclosed "(drumsticks"
    .replace(/[½¼¾⅓⅔⅛]/g, ' ')              // unicode fractions
    .replace(LEADING_QTY, '')              // leading quantities and ranges
    .replace(UNIT_WORDS, '')               // leading units
    .replace(LEADING_QTY, '')              // quantity left behind after a unit
    .replace(UNIT_WORDS, '');
  s = s.split(DESCRIPTOR_CUTOFF)[0];      // keep only the name before prep notes
  s = s.replace(/[^a-z\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/^-+/, '').replace(/^(?:inch|inches)\b\s*/, '').trim(); // "1/4-inch thick" leftovers
  s = s.replace(FILLER_WORDS, '').replace(/^-+/, '').trim();
  s = s.replace(FILLER_WORDS, '').trim();

  const words = s.split(' ').filter(Boolean);
  if (s.length < 3 || words.length === 0 || words.length > 4) return '';
  if (words.length === 1 && NOT_AN_INGREDIENT.test(s)) return '';
  if (s.includes('step') || s.includes('instruction')) return '';
  return s;
}

function useIngredients() {
  const [allIngredients, setAllIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/recipes.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load recipes.csv');
        }
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Extract all ingredients from each recipe
            const ingredientsSet = new Set();
            
            results.data.forEach(recipe => {
              if (recipe.ingredients) {
                // Split ingredients by common separators (commas, and, etc.)
                const ingredientList = recipe.ingredients
                  .split(/,(?![^(]*\))/) // Split by comma not inside parentheses
                  .flatMap(part => part.split(/\s+and\s+/i)); // Split by "and"
                
                ingredientList.forEach(ingredient => {
                  const cleanIngredient = cleanIngredientName(ingredient);
                  if (cleanIngredient) {
                    ingredientsSet.add(cleanIngredient);
                  }
                });
              }
            });
            
            // Convert set to sorted array
            const ingredientsList = Array.from(ingredientsSet).sort();
            console.log(`Loaded ${ingredientsList.length} unique ingredients`);
            setAllIngredients(ingredientsList);
            setLoading(false);
          },
          error: (err) => {
            setError(err);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { allIngredients, loading, error };
}

export default useIngredients;