
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Star, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const recentRecipes = [
    { id: 1, name: "Pasta Primavera", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBhc3RhfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60" },
    { id: 2, name: "Greek Salad", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JlZWslMjBzYWxhZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" },
    { id: 3, name: "Berry Smoothie", image: "https://images.unsplash.com/photo-1553530666-ba11a90061fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVycnklMjBzbW9vdGhpZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome to FreshMeal</h1>
          <p className="text-muted-foreground">Your personal meal planning assistant</p>
        </div>
        <Button asChild>
          <Link to="/recipes">
            <Plus className="mr-2 h-4 w-4" /> New Recipe
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Utensils className="mr-2 h-5 w-5 text-primary" />
              Recipe Collection
            </CardTitle>
            <CardDescription>Browse your recipes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">24</p>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/recipes">View all</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Weekly Plan
            </CardTitle>
            <CardDescription>Your upcoming meals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5 meals planned</p>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/meal-planner">Plan meals</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Star className="mr-2 h-5 w-5 text-primary" />
              Favorites
            </CardTitle>
            <CardDescription>Your favorite recipes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/recipes">View favorites</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recentRecipes.map(recipe => (
            <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-md recipe-card-transition">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{recipe.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
