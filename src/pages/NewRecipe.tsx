
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Plus, Minus } from "lucide-react";
import { storageService } from "@/services/storage";
import { useToast } from "@/hooks/use-toast";

const categories = ["Main Course", "Salad", "Breakfast", "Dessert", "Beverage", "Appetizer", "Side Dish"];
const difficulties = ["Easy", "Medium", "Hard"];

const NewRecipe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    prepTime: "",
    cookTime: "",
    servings: 1,
    category: "",
    difficulty: "",
    ingredients: [""],
    instructions: [""],
    nutrition: {
      calories: 0,
      protein: "",
      carbs: "",
      fat: "",
      fiber: ""
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNutritionChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      nutrition: { ...prev.nutrition, [field]: value }
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ""]
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.category || !formData.difficulty) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty ingredients and instructions
    const filteredIngredients = formData.ingredients.filter(ing => ing.trim() !== "");
    const filteredInstructions = formData.instructions.filter(inst => inst.trim() !== "");

    if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one ingredient and one instruction.",
        variant: "destructive"
      });
      return;
    }

    // Create the recipe
    const newRecipe = {
      ...formData,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      image: formData.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    };

    try {
      const savedRecipe = storageService.addRecipe(newRecipe);
      toast({
        title: "Success!",
        description: `${savedRecipe.name} has been added to your recipes.`
      });
      navigate("/recipes");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" asChild>
          <Link to="/recipes">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to recipes
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Recipe</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Recipe Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter recipe name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your recipe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recipe Details */}
          <Card>
            <CardHeader>
              <CardTitle>Recipe Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prepTime">Prep Time</Label>
                  <Input
                    id="prepTime"
                    value={formData.prepTime}
                    onChange={(e) => handleInputChange("prepTime", e.target.value)}
                    placeholder="15 min"
                  />
                </div>

                <div>
                  <Label htmlFor="cookTime">Cook Time</Label>
                  <Input
                    id="cookTime"
                    value={formData.cookTime}
                    onChange={(e) => handleInputChange("cookTime", e.target.value)}
                    placeholder="30 min"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  value={formData.servings}
                  onChange={(e) => handleInputChange("servings", parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                  disabled={formData.ingredients.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addIngredient}>
              <Plus className="mr-2 h-4 w-4" /> Add Ingredient
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <Textarea
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeInstruction(index)}
                  disabled={formData.instructions.length === 1}
                  className="mt-2"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addInstruction}>
              <Plus className="mr-2 h-4 w-4" /> Add Step
            </Button>
          </CardContent>
        </Card>

        {/* Nutrition */}
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Information (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={formData.nutrition.calories}
                  onChange={(e) => handleNutritionChange("calories", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="protein">Protein</Label>
                <Input
                  id="protein"
                  value={formData.nutrition.protein}
                  onChange={(e) => handleNutritionChange("protein", e.target.value)}
                  placeholder="0g"
                />
              </div>
              <div>
                <Label htmlFor="carbs">Carbs</Label>
                <Input
                  id="carbs"
                  value={formData.nutrition.carbs}
                  onChange={(e) => handleNutritionChange("carbs", e.target.value)}
                  placeholder="0g"
                />
              </div>
              <div>
                <Label htmlFor="fat">Fat</Label>
                <Input
                  id="fat"
                  value={formData.nutrition.fat}
                  onChange={(e) => handleNutritionChange("fat", e.target.value)}
                  placeholder="0g"
                />
              </div>
              <div>
                <Label htmlFor="fiber">Fiber</Label>
                <Input
                  id="fiber"
                  value={formData.nutrition.fiber}
                  onChange={(e) => handleNutritionChange("fiber", e.target.value)}
                  placeholder="0g"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Create Recipe
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/recipes")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewRecipe;
