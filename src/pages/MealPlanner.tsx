
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { format, startOfWeek, addDays } from "date-fns";
import * as db from "@/services/database";

// Interface definitions
interface Recipe {
  id: number;
  name: string;
}

interface MealType {
  id: number;
  name: string;
}

interface PlannedMeal {
  id?: number;
  recipe: Recipe | null;
}

interface DailyMeals {
  [mealType: string]: PlannedMeal | null;
}

interface WeeklyMeals {
  [date: string]: DailyMeals;
}

const MealPlanner = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [plannedMeals, setPlannedMeals] = useState<WeeklyMeals>({});
  const [recipeOptions, setRecipeOptions] = useState<Recipe[]>([]);
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [currentEditMeal, setCurrentEditMeal] = useState({ date: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [userId] = useState<number>(1); // Default user ID for demo purposes
  const [userPlanId, setUserPlanId] = useState<number>(1); // Default plan ID
  const { toast } = useToast();

  const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Use sample data instead of trying to connect to MySQL directly
        // MySQL can't run in the browser environment
        useSampleData();
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Instead of trying to load from MySQL, just update the week view
      // with our sample data when the date changes
      updateWeekView(selectedDate);
    }
  }, [selectedDate]);

  // Function to update the weekly view based on the selected date
  const updateWeekView = (date: Date) => {
    // This is a simpler function that just ensures we're showing
    // the right week of data based on the selected date
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = addDays(weekStart, 6);
    
    // No need to fetch from database, we're using sample data
    console.log(`Updating week view for: ${format(weekStart, "yyyy-MM-dd")} to ${format(weekEnd, "yyyy-MM-dd")}`);
  };

  const loadWeeklyMealPlan = async (date: Date) => {
    // This function is now a placeholder since we're using sample data
    // In a real application, this would be where we'd call an API
    updateWeekView(date);
  };

  const useSampleData = () => {
    // Sample recipe data
    setRecipeOptions([
      { id: 1, name: "Pasta Primavera" },
      { id: 2, name: "Greek Salad" },
      { id: 3, name: "Berry Smoothie" },
      { id: 4, name: "Chicken Curry" },
      { id: 5, name: "Avocado Toast" },
      { id: 6, name: "Chocolate Brownie" },
    ]);
    
    // Sample meal types
    setMealTypes(["breakfast", "lunch", "dinner"]);
    
    // Sample planned meals
    setPlannedMeals({
      "2025-05-21": {
        breakfast: { recipe: { id: 5, name: "Avocado Toast" } },
        lunch: { recipe: { id: 2, name: "Greek Salad" } },
        dinner: { recipe: { id: 1, name: "Pasta Primavera" } }
      },
      "2025-05-22": {
        breakfast: { recipe: { id: 3, name: "Berry Smoothie" } },
        lunch: null,
        dinner: { recipe: { id: 4, name: "Chicken Curry" } }
      },
      "2025-05-23": {
        breakfast: null,
        lunch: { recipe: { id: 2, name: "Greek Salad" } },
        dinner: null
      }
    });
  };

  const handleSelectMeal = async (recipeId: number, recipeName: string) => {
    const { date, type } = currentEditMeal;
    if (!date || !type) return;
    
    try {
      // Instead of using the database directly, we'll just update our state
      setPlannedMeals(prev => {
        const dateFormatted = date;
        const existingDateMeals = prev[dateFormatted] || {};
        
        return {
          ...prev,
          [dateFormatted]: {
            ...existingDateMeals,
            [type]: { recipe: { id: recipeId, name: recipeName } }
          }
        };
      });
      
      toast({
        title: "Meal added",
        description: `${recipeName} added to ${type} on ${format(new Date(date), "EEEE, MMMM d")}`,
      });
    } catch (error) {
      console.error("Failed to add meal:", error);
      toast({
        title: "Error",
        description: "Failed to add meal to plan.",
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };

  const handleRemoveMeal = async () => {
    const { date, type } = currentEditMeal;
    if (!date || !type) return;
    
    try {
      // Update state directly instead of using the database
      setPlannedMeals(prev => {
        const dateFormatted = date;
        const existingDateMeals = prev[dateFormatted] || {};
        
        // Get the meal to show in the toast notification
        const meal = getMealForDay(date, type);
        
        toast({
          title: "Meal removed",
          description: `Removed ${meal?.recipe?.name || 'meal'} from ${type} on ${format(new Date(date), "EEEE, MMMM d")}`,
        });
        
        return {
          ...prev,
          [dateFormatted]: {
            ...existingDateMeals,
            [type]: null
          }
        };
      });
    } catch (error) {
      console.error("Failed to remove meal:", error);
      toast({
        title: "Error",
        description: "Failed to remove meal from plan.",
        variant: "destructive",
      });
    }
    
    setOpen(false);
  };

  const getMealForDay = (date: string, mealType: string): PlannedMeal | null => {
    return plannedMeals[date]?.[mealType] || null;
  };

  // Generate week days starting from selected date
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meal Planner</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setSelectedDate(new Date())}>
            Today
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Date</DialogTitle>
                <DialogDescription>Choose a date to view or edit your meal plan</DialogDescription>
              </DialogHeader>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Week of {format(weekStart, "MMMM d, yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSelectedDate(addDays(weekStart, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="icon"
            onClick={() => setSelectedDate(addDays(weekStart, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-2">
            {/* Header row */}
            <div className="bg-muted p-2 rounded-tl-lg"></div>
            {weekDays.map((day, i) => (
              <div
                key={i}
                className={`bg-muted p-2 text-center font-medium ${
                  i === 6 ? "rounded-tr-lg" : ""
                }`}
              >
                <div>{format(day, "EEE")}</div>
                <div className="text-sm text-muted-foreground">{format(day, "MMM d")}</div>
              </div>
            ))}

            {/* Meal type rows */}
            {mealTypes.map((mealType, mealIndex) => (
              <React.Fragment key={mealType}>
                {/* Meal type header */}
                <div className={`bg-muted p-2 flex items-center justify-center ${
                  mealIndex === mealTypes.length - 1 ? "rounded-bl-lg" : ""
                }`}>
                  <span className="capitalize font-medium">{mealType}</span>
                </div>

                {/* Daily meals */}
                {weekDays.map((day, dayIndex) => {
                  const dateKey = formatDateKey(day);
                  const meal = getMealForDay(dateKey, mealType);
                  
                  return (
                    <Card
                      key={`${mealType}-${dayIndex}`}
                      className={`border ${
                        dayIndex === 6 && mealIndex === mealTypes.length - 1 ? "rounded-br-lg" : ""
                      }`}
                    >
                      <CardContent className="p-2 h-full flex flex-col">
                        {meal?.recipe ? (
                          <div 
                            className="text-sm cursor-pointer flex-1 flex items-center justify-center text-center hover:bg-muted rounded p-1"
                            onClick={() => {
                              setCurrentEditMeal({ date: dateKey, type: mealType });
                              setOpen(true);
                            }}
                          >
                            {meal.recipe.name}
                          </div>
                        ) : (
                          <div
                            className="text-muted-foreground text-xs flex-1 flex items-center justify-center hover:bg-muted rounded p-1 cursor-pointer"
                            onClick={() => {
                              setCurrentEditMeal({ date: dateKey, type: mealType });
                              setOpen(true);
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add meal
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Meal selection dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {getMealForDay(currentEditMeal.date, currentEditMeal.type)?.recipe 
                ? "Edit Meal" 
                : "Add a Meal"}
            </DialogTitle>
            <DialogDescription>
              {currentEditMeal.date ? format(
                new Date(currentEditMeal.date),
                "EEEE, MMMM d"
              ) : ""} - {currentEditMeal.type}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Select onValueChange={(value) => {
              const selected = recipeOptions.find(r => r.id === Number(value));
              if (selected) {
                handleSelectMeal(selected.id, selected.name);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a recipe" />
              </SelectTrigger>
              <SelectContent>
                {recipeOptions.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id.toString()}>
                    {recipe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {getMealForDay(currentEditMeal.date, currentEditMeal.type)?.recipe && (
              <Button variant="destructive" onClick={handleRemoveMeal} className="w-full">
                Remove Meal
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MealPlanner;
