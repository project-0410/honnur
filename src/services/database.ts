import mysql from 'mysql2/promise';
import { databaseConfig } from '@/config/database.config';

// Create a connection pool
const pool = mysql.createPool(databaseConfig);

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function getMealTypes() {
  return query<{type_id: number, name: string}[]>('SELECT * FROM meal_types');
}

export async function getRecipes() {
  return query<{recipe_id: number, title: string, category_id: number}[]>(
    'SELECT recipe_id, title, category_id FROM recipes'
  );
}

export async function getMealPlans(userId: number, startDate: string, endDate: string) {
  return query<any[]>(
    `SELECT pm.*, r.title as recipe_name, mt.name as meal_type 
     FROM planned_meals pm
     JOIN recipes r ON pm.recipe_id = r.recipe_id
     JOIN meal_types mt ON pm.meal_type_id = mt.type_id
     JOIN meal_plans mp ON pm.plan_id = mp.plan_id
     WHERE mp.user_id = ? AND pm.day_date BETWEEN ? AND ?`,
    [userId, startDate, endDate]
  );
}

export async function addPlannedMeal(planId: number, recipeId: number, mealTypeId: number, dayDate: string, servings: number = 1) {
  return query<any>(
    `INSERT INTO planned_meals (plan_id, recipe_id, meal_type_id, day_date, servings) 
     VALUES (?, ?, ?, ?, ?)`,
    [planId, recipeId, mealTypeId, dayDate, servings]
  );
}

export async function removePlannedMeal(plannedMealId: number) {
  return query<any>(
    `DELETE FROM planned_meals WHERE planned_meal_id = ?`,
    [plannedMealId]
  );
}

export async function getUserDefaultPlan(userId: number) {
  const plans = await query<{plan_id: number, name: string}[]>(
    `SELECT plan_id, name FROM meal_plans WHERE user_id = ? ORDER BY created_at ASC LIMIT 1`,
    [userId]
  );
  return plans[0];
}
