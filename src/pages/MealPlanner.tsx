
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
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
import { storageService, Recipe, MealPlan } from "@/services/storage";
import { useToast } from "@/hooks/use-toast";

const mealTypes = ["breakfast", "lunch", "dinner"];

const MealPlanner = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [plannedMeals, setPlannedMeals] = useState<MealPlan>({});
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [open, setOpen] = useState(false);
  const [currentEditMeal, setCurrentEditMeal] = useState({ date: "", type: "" });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedMealPlans = storageService.getMealPlans();
    const loadedRecipes = storageService.getRecipes();
    setPlannedMeals(loadedMealPlans);
    setRecipes(loadedRecipes);
  };

  const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");

  const handleSelectMeal = (recipeId: number, recipeName: string) => {
    const { date, type } = currentEditMeal;
    if (!date || !type) return;
    
    const selectedRecipe = recipes.find(r => r.id === recipeId);
    if (!selectedRecipe) return;

    storageService.addMealToPlan(date, type, selectedRecipe);
    loadData(); // Reload data to reflect changes
    
    toast({
      title: "Meal Added",
      description: `${recipeName} has been added to your ${type} for ${format(new Date(date), "MMMM d")}.`,
    });
    setOpen(false);
  };

  const handleRemoveMeal = () => {
    const { date, type } = currentEditMeal;
    if (!date || !type) return;
    
    storageService.removeMealFromPlan(date, type);
    loadData(); // Reload data to reflect changes
    
    toast({
      title: "Meal Removed",
      description: `Meal has been removed from your ${type} for ${format(new Date(date), "MMMM d")}.`,
    });
    setOpen(false);
  };

  const getMealForDay = (date: string, mealType: string) => {
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
                        {meal ? (
                          <div 
                            className="text-sm cursor-pointer flex-1 flex items-center justify-center text-center hover:bg-muted rounded p-1"
                            onClick={() => {
                              setCurrentEditMeal({ date: dateKey, type: mealType });
                              setOpen(true);
                            }}
                          >
                            {meal.name}
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
              {getMealForDay(currentEditMeal.date, currentEditMeal.type) 
                ? "Edit Meal" 
                : "Add a Meal"}
            </DialogTitle>
            <DialogDescription>
              {format(
                currentEditMeal.date ? new Date(currentEditMeal.date) : new Date(), 
                "EEEE, MMMM d"
              )} - {currentEditMeal.type}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Select onValueChange={(value) => {
              const selected = recipes.find(r => r.id === Number(value));
              if (selected) {
                handleSelectMeal(selected.id, selected.name);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a recipe" />
              </SelectTrigger>
              <SelectContent>
                {recipes.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id.toString()}>
                    {recipe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {getMealForDay(currentEditMeal.date, currentEditMeal.type) && (
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
