import { MealResponse, FilterResponse } from '../types';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const searchMealsByName = async (name: string): Promise<MealResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching meals by name:", error);
    return { meals: null };
  }
};

export const filterMealsByIngredient = async (ingredient: string): Promise<FilterResponse> => {
  try {
    // Note: This endpoint only returns partial meal data (id, name, thumb)
    const response = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Error filtering meals by ingredient:", error);
    return { meals: null };
  }
};

export const getMealById = async (id: string): Promise<MealResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching meal details:", error);
    return { meals: null };
  }
};
