
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, ChevronLeft, Utensils, Users, Calendar, Plus } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useEffect, useState } from "react";

// Sample recipes data - in a real application, this would be fetched from an API
const recipesData = [
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

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find recipe by ID from our local data
    // In a real app, we would fetch the recipe data from an API
    const recipeId = parseInt(id || "0");
    const foundRecipe = recipesData.find(r => r.id === recipeId);
    setRecipe(foundRecipe || null);
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">Loading recipe...</p>
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
        <Button asChild>
          <Link to="/recipes">Back to recipes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center space-x-4 mb-4">
        <Button variant="ghost" asChild>
          <Link to="/recipes">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to recipes
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.name} 
              className="w-full h-64 object-cover"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
            <p className="text-muted-foreground mb-4">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-4 my-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Prep Time</p>
                  <p className="text-sm">{recipe.prepTime}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Utensils className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Cook Time</p>
                  <p className="text-sm">{recipe.cookTime}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Servings</p>
                  <p className="text-sm">{recipe.servings}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-4">
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Add to Meal Plan
              </Button>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Shopping List
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <Tabs defaultValue="ingredients">
            <TabsList className="w-full">
              <TabsTrigger value="ingredients" className="flex-1">Ingredients</TabsTrigger>
              <TabsTrigger value="instructions" className="flex-1">Instructions</TabsTrigger>
              <TabsTrigger value="nutrition" className="flex-1">Nutrition</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ingredients" className="mt-4">
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                <p className="text-sm text-muted-foreground mb-4">For {recipe.servings} servings</p>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <div className="mr-3 h-1.5 w-1.5 rounded-full bg-primary" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>
            
            <TabsContent value="instructions" className="mt-4">
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                <ol className="space-y-4">
                  {recipe.instructions.map((step: string, index: number) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm mr-3">
                        {index + 1}
                      </span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </Card>
            </TabsContent>
            
            <TabsContent value="nutrition" className="mt-4">
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Nutrition Information</h2>
                <p className="text-sm text-muted-foreground mb-4">Per serving</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Calories</p>
                    <p className="font-semibold">{recipe.nutrition.calories}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Protein</p>
                    <p className="font-semibold">{recipe.nutrition.protein}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Carbs</p>
                    <p className="font-semibold">{recipe.nutrition.carbs}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Fat</p>
                    <p className="font-semibold">{recipe.nutrition.fat}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Fiber</p>
                    <p className="font-semibold">{recipe.nutrition.fiber}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
