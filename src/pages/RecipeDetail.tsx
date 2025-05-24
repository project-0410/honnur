
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, ChevronLeft, Utensils, Users, Calendar, Plus } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { storageService, Recipe } from "@/services/storage";
import { format, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [mealPlanDialogOpen, setMealPlanDialogOpen] = useState(false);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = () => {
    const recipeId = parseInt(id || "0");
    const recipes = storageService.getRecipes();
    const foundRecipe = recipes.find(r => r.id === recipeId);
    setRecipe(foundRecipe || null);
    setLoading(false);
  };

  const handleAddToShoppingList = () => {
    if (!recipe) return;
    
    storageService.addRecipeIngredientsToShoppingList(recipe);
    toast({
      title: "Added to Shopping List",
      description: `${recipe.name} ingredients have been added to your shopping list.`,
    });
  };

  const handleAddToMealPlan = (date: string, mealType: string) => {
    if (!recipe) return;
    
    storageService.addMealToPlan(date, mealType, recipe);
    toast({
      title: "Added to Meal Plan",
      description: `${recipe.name} has been added to your ${mealType} for ${format(new Date(date), "MMMM d")}.`,
    });
    setMealPlanDialogOpen(false);
  };

  // Generate next 7 days for meal planning
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      days.push({
        date: format(date, "yyyy-MM-dd"),
        display: format(date, "EEEE, MMM d")
      });
    }
    return days;
  };
  
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
              <Dialog open={mealPlanDialogOpen} onOpenChange={setMealPlanDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Add to Meal Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add to Meal Plan</DialogTitle>
                    <DialogDescription>
                      Choose when you want to have {recipe.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {getNext7Days().map(day => (
                      <div key={day.date} className="space-y-2">
                        <h4 className="font-medium">{day.display}</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddToMealPlan(day.date, "breakfast")}
                          >
                            Breakfast
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddToMealPlan(day.date, "lunch")}
                          >
                            Lunch
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddToMealPlan(day.date, "dinner")}
                          >
                            Dinner
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={handleAddToShoppingList}>
                <Plus className="mr-2 h-4 w-4" />
                Add to Shopping List
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
