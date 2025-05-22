
// API service for making backend calls

const API_URL = 'http://localhost:5000/api';

// Generic fetch function with error handling
async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error fetching data');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error: ${error}`);
    throw error;
  }
}

// Meal planner API calls
export const mealPlannerApi = {
  getMealTypes: () => fetchFromApi<Array<{type_id: number, name: string}>>('/meal-planner/meal-types'),
  
  getPlannedMeals: (userId: number, startDate: string, endDate: string) => 
    fetchFromApi<Array<any>>(`/meal-planner/plans/${userId}?startDate=${startDate}&endDate=${endDate}`),
  
  getDefaultPlan: (userId: number) => 
    fetchFromApi<{plan_id: number, name: string}>(`/meal-planner/default-plan/${userId}`),
  
  addPlannedMeal: (planId: number, recipeId: number, mealTypeId: number, dayDate: string, servings: number = 1) => 
    fetchFromApi('/meal-planner/planned-meals', {
      method: 'POST',
      body: JSON.stringify({ planId, recipeId, mealTypeId, dayDate, servings }),
    }),
  
  removePlannedMeal: (plannedMealId: number) => 
    fetchFromApi(`/meal-planner/planned-meals/${plannedMealId}`, {
      method: 'DELETE',
    }),
};

// Recipe API calls
export const recipeApi = {
  getAllRecipes: () => fetchFromApi<Array<{recipe_id: number, title: string, category_id: number}>>('/recipes'),
  
  getRecipeById: (id: number) => fetchFromApi<any>(`/recipes/${id}`),
  
  getRecipesByCategory: (categoryId: number) => 
    fetchFromApi<Array<any>>(`/recipes/category/${categoryId}`),
};

export default {
  mealPlanner: mealPlannerApi,
  recipes: recipeApi,
};
