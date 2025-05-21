
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

const recipeData = {
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
};

const RecipeDetail = () => {
  const { id } = useParams();
  // In a real app, we would fetch the recipe data based on the ID
  // For this example, we'll use the sample data
  
  if (!recipeData) {
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
              src={recipeData.image} 
              alt={recipeData.name} 
              className="w-full h-64 object-cover"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{recipeData.name}</h1>
            <p className="text-muted-foreground mb-4">{recipeData.description}</p>
            
            <div className="flex flex-wrap gap-4 my-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Prep Time</p>
                  <p className="text-sm">{recipeData.prepTime}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Utensils className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Cook Time</p>
                  <p className="text-sm">{recipeData.cookTime}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Servings</p>
                  <p className="text-sm">{recipeData.servings}</p>
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
                <p className="text-sm text-muted-foreground mb-4">For {recipeData.servings} servings</p>
                <ul className="space-y-2">
                  {recipeData.ingredients.map((ingredient, index) => (
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
                  {recipeData.instructions.map((step, index) => (
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
                    <p className="font-semibold">{recipeData.nutrition.calories}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Protein</p>
                    <p className="font-semibold">{recipeData.nutrition.protein}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Carbs</p>
                    <p className="font-semibold">{recipeData.nutrition.carbs}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Fat</p>
                    <p className="font-semibold">{recipeData.nutrition.fat}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Fiber</p>
                    <p className="font-semibold">{recipeData.nutrition.fiber}</p>
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
