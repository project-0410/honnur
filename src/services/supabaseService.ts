
import { supabase } from "@/integrations/supabase/client";

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  category: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface MealPlan {
  id?: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  recipe_id: string | null;
  recipe?: Recipe | null;
}

export interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  category: string;
  created_at?: string;
}

// Helper function to safely parse JSON data
const safeParseArray = (data: any): string[] => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const safeParseNutrition = (data: any) => {
  const defaultNutrition = { calories: 0, protein: '0g', carbs: '0g', fat: '0g', fiber: '0g' };
  
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    return {
      calories: typeof data.calories === 'number' ? data.calories : 0,
      protein: typeof data.protein === 'string' ? data.protein : '0g',
      carbs: typeof data.carbs === 'string' ? data.carbs : '0g',
      fat: typeof data.fat === 'string' ? data.fat : '0g',
      fiber: typeof data.fiber === 'string' ? data.fiber : '0g',
    };
  }
  
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return safeParseNutrition(parsed);
    } catch {
      return defaultNutrition;
    }
  }
  
  return defaultNutrition;
};

class SupabaseService {
  // Recipe methods
  async getRecipes(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
    
    return data.map(recipe => ({
      ...recipe,
      ingredients: safeParseArray(recipe.ingredients),
      instructions: safeParseArray(recipe.instructions),
      nutrition: safeParseNutrition(recipe.nutrition)
    }));
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      ...data,
      ingredients: safeParseArray(data.ingredients),
      instructions: safeParseArray(data.instructions),
      nutrition: safeParseNutrition(data.nutrition)
    };
  }

  async addRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .insert([{
        name: recipe.name,
        description: recipe.description,
        image: recipe.image,
        prep_time: recipe.prep_time,
        cook_time: recipe.cook_time,
        servings: recipe.servings,
        category: recipe.category,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition: recipe.nutrition
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
    
    return {
      ...data,
      ingredients: safeParseArray(data.ingredients),
      instructions: safeParseArray(data.instructions),
      nutrition: safeParseNutrition(data.nutrition)
    };
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe | null> {
    // Note: updated_at will be automatically updated by the database trigger
    const { data, error } = await supabase
      .from('recipes')
      .update({
        name: updates.name,
        description: updates.description,
        image: updates.image,
        prep_time: updates.prep_time,
        cook_time: updates.cook_time,
        servings: updates.servings,
        category: updates.category,
        difficulty: updates.difficulty,
        ingredients: updates.ingredients,
        instructions: updates.instructions,
        nutrition: updates.nutrition
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      ...data,
      ingredients: safeParseArray(data.ingredients),
      instructions: safeParseArray(data.instructions),
      nutrition: safeParseNutrition(data.nutrition)
    };
  }

  async deleteRecipe(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting recipe:', error);
        // Check if it's the meal plan constraint error
        if (error.message.includes('meal plan')) {
          throw new Error('Cannot delete recipe: it is currently used in meal plans. Please remove it from meal plans first.');
        }
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  }

  // Meal plan methods
  async getMealPlans(): Promise<MealPlan[]> {
    const { data, error } = await supabase
      .from('meal_plans')
      .select(`
        *,
        recipes (*)
      `)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching meal plans:', error);
      throw error;
    }
    
    return data.map(plan => ({
      id: plan.id,
      date: plan.date,
      meal_type: plan.meal_type as 'breakfast' | 'lunch' | 'dinner',
      recipe_id: plan.recipe_id,
      recipe: plan.recipes ? {
        ...plan.recipes,
        ingredients: safeParseArray(plan.recipes.ingredients),
        instructions: safeParseArray(plan.recipes.instructions),
        nutrition: safeParseNutrition(plan.recipes.nutrition)
      } : null
    }));
  }

  async addMealToPlan(date: string, mealType: 'breakfast' | 'lunch' | 'dinner', recipeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .upsert({
          date,
          meal_type: mealType,
          recipe_id: recipeId
        });
      
      if (error) {
        console.error('Error adding meal to plan:', error);
        // Check for validation errors from triggers
        if (error.message.includes('past date')) {
          throw new Error('Cannot create meal plan for past dates.');
        }
        if (error.message.includes('Invalid meal_type')) {
          throw new Error('Invalid meal type. Must be breakfast, lunch, or dinner.');
        }
        throw error;
      }
      
      // Note: Ingredients will be automatically added to shopping list by the database trigger
      console.log('Meal added to plan. Ingredients automatically added to shopping list.');
    } catch (error) {
      console.error('Error adding meal to plan:', error);
      throw error;
    }
  }

  async removeMealFromPlan(date: string, mealType: 'breakfast' | 'lunch' | 'dinner'): Promise<void> {
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('date', date)
      .eq('meal_type', mealType);
    
    if (error) {
      console.error('Error removing meal from plan:', error);
      throw error;
    }
  }

  // Shopping list methods
  async getShoppingList(): Promise<ShoppingItem[]> {
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shopping list:', error);
      throw error;
    }
    
    return data || [];
  }

  async addShoppingItem(name: string, category: string): Promise<ShoppingItem> {
    const { data, error } = await supabase
      .from('shopping_items')
      .insert([{
        name: name.trim(),
        category,
        completed: false
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding shopping item:', error);
      throw error;
    }
    
    return data;
  }

  // Note: This method is now less needed since ingredients are automatically added by triggers
  async addRecipeIngredientsToShoppingList(recipe: Recipe): Promise<void> {
    const existingItems = await this.getShoppingList();
    const existingNames = new Set(existingItems.map(item => item.name.toLowerCase()));
    
    const newItems = recipe.ingredients
      .filter(ingredient => !existingNames.has(ingredient.toLowerCase()))
      .map(ingredient => ({
        name: ingredient,
        category: 'Other',
        completed: false
      }));
    
    if (newItems.length > 0) {
      const { error } = await supabase
        .from('shopping_items')
        .insert(newItems);
      
      if (error) {
        console.error('Error adding recipe ingredients to shopping list:', error);
        throw error;
      }
    }
  }

  async updateShoppingItem(id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem | null> {
    const { data, error } = await supabase
      .from('shopping_items')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error updating shopping item:', error);
      throw error;
    }
    
    return data;
  }

  async deleteShoppingItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting shopping item:', error);
      throw error;
    }
    
    return true;
  }

  async clearCompletedShoppingItems(): Promise<void> {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('completed', true);
    
    if (error) {
      console.error('Error clearing completed shopping items:', error);
      throw error;
    }
  }
}

export const supabaseService = new SupabaseService();
