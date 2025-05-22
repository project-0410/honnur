
// This file is now just providing mock functions that would normally
// interact with a database, but for a browser environment, we'll just
// log that we would be making these calls.

// In a real application, these would make API calls to a backend
// that would then interact with the database

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  console.log("Would execute query:", sql, params);
  return [] as unknown as T;
}

export async function getMealTypes() {
  console.log("Would fetch meal types from the database");
  return [
    { type_id: 1, name: 'Breakfast' },
    { type_id: 2, name: 'Lunch' },
    { type_id: 3, name: 'Dinner' }
  ];
}

export async function getRecipes() {
  console.log("Would fetch recipes from the database");
  return [
    { recipe_id: 1, title: 'Pasta Primavera', category_id: 1 },
    { recipe_id: 2, title: 'Greek Salad', category_id: 2 },
    { recipe_id: 3, title: 'Berry Smoothie', category_id: 3 },
    { recipe_id: 4, title: 'Chicken Curry', category_id: 1 },
    { recipe_id: 5, title: 'Avocado Toast', category_id: 2 },
    { recipe_id: 6, title: 'Chocolate Brownie', category_id: 3 }
  ];
}

export async function getMealPlans(userId: number, startDate: string, endDate: string) {
  console.log(`Would fetch meal plans for user ${userId} from ${startDate} to ${endDate}`);
  return [];
}

export async function addPlannedMeal(planId: number, recipeId: number, mealTypeId: number, dayDate: string, servings: number = 1) {
  console.log(`Would add planned meal: plan=${planId}, recipe=${recipeId}, mealType=${mealTypeId}, date=${dayDate}, servings=${servings}`);
  return { insertId: Math.floor(Math.random() * 1000) };
}

export async function removePlannedMeal(plannedMealId: number) {
  console.log(`Would remove planned meal with ID ${plannedMealId}`);
  return { affectedRows: 1 };
}

export async function getUserDefaultPlan(userId: number) {
  console.log(`Would get default meal plan for user ${userId}`);
  return { plan_id: 1, name: 'Default Plan' };
}
