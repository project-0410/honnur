
// Local storage service for offline functionality
export interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  prepTime: string;
  cookTime: string;
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
}

export interface MealPlan {
  [date: string]: {
    breakfast?: Recipe | null;
    lunch?: Recipe | null;
    dinner?: Recipe | null;
  };
}

export interface ShoppingItem {
  id: number;
  name: string;
  completed: boolean;
  category: string;
}

class StorageService {
  private RECIPES_KEY = 'freshMeal_recipes';
  private MEAL_PLANS_KEY = 'freshMeal_mealPlans';
  private SHOPPING_LIST_KEY = 'freshMeal_shoppingList';

  // Recipe methods
  getRecipes(): Recipe[] {
    const stored = localStorage.getItem(this.RECIPES_KEY);
    return stored ? JSON.parse(stored) : this.getDefaultRecipes();
  }

  saveRecipes(recipes: Recipe[]): void {
    localStorage.setItem(this.RECIPES_KEY, JSON.stringify(recipes));
  }

  addRecipe(recipe: Omit<Recipe, 'id'>): Recipe {
    const recipes = this.getRecipes();
    const newRecipe = { ...recipe, id: Date.now() };
    recipes.push(newRecipe);
    this.saveRecipes(recipes);
    return newRecipe;
  }

  updateRecipe(id: number, updates: Partial<Recipe>): Recipe | null {
    const recipes = this.getRecipes();
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    recipes[index] = { ...recipes[index], ...updates };
    this.saveRecipes(recipes);
    return recipes[index];
  }

  deleteRecipe(id: number): boolean {
    const recipes = this.getRecipes();
    const filtered = recipes.filter(r => r.id !== id);
    if (filtered.length !== recipes.length) {
      this.saveRecipes(filtered);
      return true;
    }
    return false;
  }

  // Meal plan methods
  getMealPlans(): MealPlan {
    const stored = localStorage.getItem(this.MEAL_PLANS_KEY);
    return stored ? JSON.parse(stored) : this.getDefaultMealPlans();
  }

  saveMealPlans(mealPlans: MealPlan): void {
    localStorage.setItem(this.MEAL_PLANS_KEY, JSON.stringify(mealPlans));
  }

  addMealToPlan(date: string, mealType: string, recipe: Recipe): void {
    const mealPlans = this.getMealPlans();
    if (!mealPlans[date]) {
      mealPlans[date] = {};
    }
    mealPlans[date][mealType] = recipe;
    this.saveMealPlans(mealPlans);
  }

  removeMealFromPlan(date: string, mealType: string): void {
    const mealPlans = this.getMealPlans();
    if (mealPlans[date]) {
      mealPlans[date][mealType] = null;
      this.saveMealPlans(mealPlans);
    }
  }

  // Shopping list methods
  getShoppingList(): ShoppingItem[] {
    const stored = localStorage.getItem(this.SHOPPING_LIST_KEY);
    return stored ? JSON.parse(stored) : this.getDefaultShoppingList();
  }

  saveShoppingList(items: ShoppingItem[]): void {
    localStorage.setItem(this.SHOPPING_LIST_KEY, JSON.stringify(items));
  }

  addShoppingItem(name: string, category: string): ShoppingItem {
    const items = this.getShoppingList();
    const newItem: ShoppingItem = {
      id: Date.now(),
      name: name.trim(),
      completed: false,
      category
    };
    items.push(newItem);
    this.saveShoppingList(items);
    return newItem;
  }

  addRecipeIngredientsToShoppingList(recipe: Recipe): void {
    const items = this.getShoppingList();
    const existingItems = new Set(items.map(item => item.name.toLowerCase()));
    
    recipe.ingredients.forEach(ingredient => {
      const ingredientName = ingredient.toLowerCase();
      if (!existingItems.has(ingredientName)) {
        const newItem: ShoppingItem = {
          id: Date.now() + Math.random(),
          name: ingredient,
          completed: false,
          category: "Other" // Default category for recipe ingredients
        };
        items.push(newItem);
        existingItems.add(ingredientName);
      }
    });
    
    this.saveShoppingList(items);
  }

  updateShoppingItem(id: number, updates: Partial<ShoppingItem>): ShoppingItem | null {
    const items = this.getShoppingList();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    this.saveShoppingList(items);
    return items[index];
  }

  deleteShoppingItem(id: number): boolean {
    const items = this.getShoppingList();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length !== items.length) {
      this.saveShoppingList(filtered);
      return true;
    }
    return false;
  }

  clearCompletedShoppingItems(): void {
    const items = this.getShoppingList();
    const filtered = items.filter(item => !item.completed);
    this.saveShoppingList(filtered);
  }

  // Default data methods
  private getDefaultRecipes(): Recipe[] {
    return [
      {
        id: 1,
        name: "Pasta Primavera",
        description: "A delicious pasta dish with fresh spring vegetables in a light cream sauce. Perfect for a quick weeknight dinner or special occasion.",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBhc3RhfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        prepTime: "15 min",
        cookTime: "15 min",
        servings: 4,
        category: "Main Course",
        difficulty: "Easy",
        ingredients: [
          "8 oz fettuccine pasta",
          "1 tablespoon olive oil",
          "1 clove garlic, minced",
          "1 red bell pepper, sliced",
          "1 yellow squash, sliced",
          "1 zucchini, sliced",
          "1 cup cherry tomatoes, halved",
          "1/2 cup frozen peas",
          "1/3 cup heavy cream",
          "1/4 cup grated Parmesan cheese",
          "2 tablespoons fresh basil, chopped",
          "Salt and pepper to taste"
        ],
        instructions: [
          "Cook pasta according to package directions. Reserve 1/2 cup pasta water before draining.",
          "Heat olive oil in a large skillet over medium heat. Add garlic and cook until fragrant, about 30 seconds.",
          "Add bell pepper, squash, and zucchini. Cook for 3-4 minutes until vegetables begin to soften.",
          "Add cherry tomatoes and peas. Cook for another 2 minutes.",
          "Reduce heat to low and stir in heavy cream and Parmesan cheese. If sauce is too thick, add reserved pasta water a little at a time.",
          "Add cooked pasta to the skillet and toss to combine with the sauce and vegetables.",
          "Season with salt and pepper to taste. Garnish with fresh basil before serving."
        ],
        nutrition: {
          calories: 320,
          protein: "12g",
          carbs: "42g",
          fat: "14g",
          fiber: "5g"
        }
      },
      {
        id: 2,
        name: "Greek Salad",
        description: "A refreshing Mediterranean salad with crisp vegetables, tangy feta cheese, and Kalamata olives. Perfect for a light lunch or as a side dish.",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JlZWslMjBzYWxhZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        prepTime: "15 min",
        cookTime: "0 min",
        servings: 4,
        category: "Salad",
        difficulty: "Easy",
        ingredients: [
          "1 English cucumber, diced",
          "4 Roma tomatoes, diced",
          "1 green bell pepper, diced",
          "1/2 red onion, thinly sliced",
          "1/2 cup Kalamata olives",
          "4 oz feta cheese, cubed or crumbled",
          "2 tablespoons extra virgin olive oil",
          "1 tablespoon red wine vinegar",
          "1 teaspoon dried oregano",
          "Salt and pepper to taste"
        ],
        instructions: [
          "In a large bowl, combine cucumber, tomatoes, bell pepper, red onion, and olives.",
          "In a small bowl, whisk together olive oil, red wine vinegar, oregano, salt, and pepper.",
          "Pour dressing over the vegetables and toss to combine.",
          "Gently fold in the feta cheese.",
          "For best flavor, let the salad chill for 30 minutes before serving."
        ],
        nutrition: {
          calories: 180,
          protein: "5g",
          carbs: "9g",
          fat: "15g",
          fiber: "3g"
        }
      },
      {
        id: 3,
        name: "Berry Smoothie",
        description: "A nutritious and refreshing smoothie packed with mixed berries, yogurt, and honey. Perfect for breakfast or a quick healthy snack.",
        image: "https://images.unsplash.com/photo-1553530666-ba11a90061fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVycnklMjBzbW9vdGhpZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        prepTime: "5 min",
        cookTime: "0 min",
        servings: 2,
        category: "Beverage",
        difficulty: "Easy",
        ingredients: [
          "1 cup mixed berries (strawberries, blueberries, raspberries)",
          "1 banana, sliced",
          "1 cup Greek yogurt",
          "1/2 cup milk (dairy or plant-based)",
          "1 tablespoon honey or maple syrup (optional)",
          "1/2 cup ice cubes",
          "1 tablespoon chia seeds (optional)"
        ],
        instructions: [
          "Add all ingredients to a blender.",
          "Blend on high speed until smooth and creamy, about 1 minute.",
          "Add more milk if a thinner consistency is desired.",
          "Pour into glasses and serve immediately."
        ],
        nutrition: {
          calories: 210,
          protein: "10g",
          carbs: "35g",
          fat: "4g",
          fiber: "6g"
        }
      },
      {
        id: 4,
        name: "Chicken Curry",
        description: "A flavorful and aromatic Indian-inspired curry with tender chicken pieces in a rich sauce. Great served with rice or naan bread.",
        image: "https://images.unsplash.com/photo-1604952187418-2bb4312d71ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hpY2tlbiUyMGN1cnJ5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        prepTime: "15 min",
        cookTime: "30 min",
        servings: 4,
        category: "Main Course",
        difficulty: "Medium",
        ingredients: [
          "1.5 lbs boneless, skinless chicken thighs, cut into pieces",
          "1 large onion, finely chopped",
          "3 cloves garlic, minced",
          "1 tablespoon ginger, grated",
          "2 tablespoons curry powder",
          "1 teaspoon cumin",
          "1 teaspoon turmeric",
          "1/2 teaspoon red chili powder (adjust to taste)",
          "1 can (14 oz) coconut milk",
          "1 cup chicken broth",
          "2 tablespoons vegetable oil",
          "Salt to taste",
          "Fresh cilantro for garnish",
          "Lime wedges for serving"
        ],
        instructions: [
          "Heat oil in a large pan over medium heat. Add onions and sauté until translucent.",
          "Add garlic and ginger, cook for 1 minute until fragrant.",
          "Add all spices and cook for 30 seconds, stirring constantly.",
          "Add chicken pieces and brown on all sides, about 5 minutes.",
          "Pour in coconut milk and chicken broth, stirring well.",
          "Bring to a simmer, then reduce heat to low and cover.",
          "Cook for 20-25 minutes until chicken is tender and sauce has thickened.",
          "Season with salt to taste.",
          "Garnish with fresh cilantro and serve with lime wedges."
        ],
        nutrition: {
          calories: 420,
          protein: "28g",
          carbs: "8g",
          fat: "32g",
          fiber: "2g"
        }
      },
      {
        id: 5,
        name: "Avocado Toast",
        description: "Simple yet delicious avocado toast with optional toppings. A nutritious and satisfying breakfast or snack that's ready in minutes.",
        image: "https://images.unsplash.com/photo-1588137378633-56c3392811c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZvY2FkbyUyMHRvYXN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        prepTime: "10 min",
        cookTime: "0 min",
        servings: 2,
        category: "Breakfast",
        difficulty: "Easy",
        ingredients: [
          "2 slices of sourdough bread (or bread of choice)",
          "1 ripe avocado",
          "1 tablespoon lemon juice",
          "1/4 teaspoon red pepper flakes (optional)",
          "Salt and black pepper to taste",
          "Optional toppings: sliced radish, microgreens, cherry tomatoes, feta cheese, poached egg"
        ],
        instructions: [
          "Toast the bread slices until golden and crisp.",
          "Cut the avocado in half, remove the pit, and scoop the flesh into a bowl.",
          "Add lemon juice, salt, and pepper to the avocado and mash with a fork to desired consistency.",
          "Spread the mashed avocado evenly on the toast slices.",
          "Sprinkle with red pepper flakes if desired.",
          "Add any optional toppings of your choice.",
          "Serve immediately."
        ],
        nutrition: {
          calories: 220,
          protein: "4g",
          carbs: "22g",
          fat: "14g",
          fiber: "7g"
        }
      },
      {
        id: 6,
        name: "Chocolate Brownie",
        description: "Rich, fudgy chocolate brownies with walnuts. The perfect indulgent dessert that's sure to satisfy any sweet tooth.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJvd25pZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        prepTime: "15 min",
        cookTime: "25 min",
        servings: 16,
        category: "Dessert",
        difficulty: "Medium",
        ingredients: [
          "1 cup unsalted butter",
          "2 cups granulated sugar",
          "4 large eggs",
          "1 tablespoon vanilla extract",
          "1 cup all-purpose flour",
          "3/4 cup unsweetened cocoa powder",
          "1/2 teaspoon salt",
          "1 cup chopped walnuts (optional)",
          "1/2 cup chocolate chips"
        ],
        instructions: [
          "Preheat oven to 350°F (175°C). Line a 9x13 inch baking pan with parchment paper.",
          "Melt butter in a large microwave-safe bowl or on the stovetop.",
          "Stir sugar into melted butter until well combined.",
          "Add eggs one at a time, mixing well after each addition.",
          "Stir in vanilla extract.",
          "In a separate bowl, whisk together flour, cocoa powder, and salt.",
          "Gradually add dry ingredients to wet ingredients, mixing until just combined.",
          "Fold in walnuts and chocolate chips if using.",
          "Pour batter into prepared pan and spread evenly.",
          "Bake for 25-30 minutes, or until a toothpick inserted in center comes out with a few moist crumbs.",
          "Allow to cool completely before cutting into squares."
        ],
        nutrition: {
          calories: 280,
          protein: "4g",
          carbs: "32g",
          fat: "16g",
          fiber: "2g"
        }
      }
    ];
  }

  private getDefaultMealPlans(): MealPlan {
    return {
      "2025-05-21": {
        breakfast: this.getDefaultRecipes()[4], // Avocado Toast
        lunch: this.getDefaultRecipes()[1], // Greek Salad
        dinner: this.getDefaultRecipes()[0] // Pasta Primavera
      },
      "2025-05-22": {
        breakfast: this.getDefaultRecipes()[2], // Berry Smoothie
        lunch: null,
        dinner: this.getDefaultRecipes()[3] // Chicken Curry
      },
      "2025-05-23": {
        breakfast: null,
        lunch: this.getDefaultRecipes()[1], // Greek Salad
        dinner: null
      }
    };
  }

  private getDefaultShoppingList(): ShoppingItem[] {
    return [
      { id: 1, name: "Pasta", completed: false, category: "Dry Goods" },
      { id: 2, name: "Bell pepper", completed: false, category: "Produce" },
      { id: 3, name: "Zucchini", completed: false, category: "Produce" },
      { id: 4, name: "Cherry tomatoes", completed: false, category: "Produce" },
      { id: 5, name: "Heavy cream", completed: false, category: "Dairy" },
      { id: 6, name: "Parmesan cheese", completed: true, category: "Dairy" },
      { id: 7, name: "Olive oil", completed: true, category: "Oils & Vinegars" },
    ];
  }
}

export const storageService = new StorageService();
