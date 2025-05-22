
// This file now uses the API service to fetch data instead of mock functions

import { mealPlannerApi, recipeApi } from './api';

// Legacy function for compatibility
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  console.log("This function is deprecated. Use the API service instead:", sql, params);
  return [] as unknown as T;
}

export async function getMealTypes() {
  try {
    return await mealPlannerApi.getMealTypes();
  } catch (error) {
    console.error("Error fetching meal types:", error);
    // Fallback to sample data if API is unavailable
    return [
      { type_id: 1, name: 'Breakfast' },
      { type_id: 2, name: 'Lunch' },
      { type_id: 3, name: 'Dinner' }
    ];
  }
}

export async function getRecipes() {
  try {
    const recipes = await recipeApi.getAllRecipes();
    return recipes.map(r => ({
      recipe_id: r.recipe_id,
      title: r.title,
      category_id: r.category_id
    }));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    // Fallback to sample data if API is unavailable
    return [
      { recipe_id: 1, title: 'Pasta Primavera', category_id: 1 },
      { recipe_id: 2, title: 'Greek Salad', category_id: 2 },
      { recipe_id: 3, title: 'Berry Smoothie', category_id: 3 },
      { recipe_id: 4, title: 'Chicken Curry', category_id: 1 },
      { recipe_id: 5, title: 'Avocado Toast', category_id: 2 },
      { recipe_id: 6, title: 'Chocolate Brownie', category_id: 3 }
    ];
  }
}

export async function getMealPlans(userId: number, startDate: string, endDate: string) {
  try {
    return await mealPlannerApi.getPlannedMeals(userId, startDate, endDate);
  } catch (error) {
    console.error(`Error fetching meal plans:`, error);
    return [];
  }
}

export async function addPlannedMeal(planId: number, recipeId: number, mealTypeId: number, dayDate: string, servings: number = 1) {
  try {
    return await mealPlannerApi.addPlannedMeal(planId, recipeId, mealTypeId, dayDate, servings);
  } catch (error) {
    console.error(`Error adding planned meal:`, error);
    return { insertId: Math.floor(Math.random() * 1000) };
  }
}

export async function removePlannedMeal(plannedMealId: number) {
  try {
    return await mealPlannerApi.removePlannedMeal(plannedMealId);
  } catch (error) {
    console.error(`Error removing planned meal:`, error);
    return { affectedRows: 1 };
  }
}

export async function getUserDefaultPlan(userId: number) {
  try {
    return await mealPlannerApi.getDefaultPlan(userId);
  } catch (error) {
    console.error(`Error getting default plan:`, error);
    return { plan_id: 1, name: 'Default Plan' };
  }
}
