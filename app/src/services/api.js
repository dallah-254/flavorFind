import { API_BASE_URL } from '../constants/config';

// Test API connection
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('API Connection Error:', error);
    throw error;
  }
};

// Search recipes by ingredients
export const searchRecipesByIngredients = async (ingredients) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/recipes?ingredients=${encodeURIComponent(ingredients)}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Get recipe details by ID
export const getRecipeDetails = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};