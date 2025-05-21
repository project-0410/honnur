
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Plus, Search } from "lucide-react";

const sampleRecipes = [
  { 
    id: 1, 
    name: "Pasta Primavera", 
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBhc3RhfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    category: "Main Course",
    time: "30 min",
    description: "Fresh vegetables and pasta in a light cream sauce"
  },
  { 
    id: 2, 
    name: "Greek Salad", 
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JlZWslMjBzYWxhZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
    category: "Salad",
    time: "15 min",
    description: "Traditional Greek salad with feta cheese and olives"
  },
  { 
    id: 3, 
    name: "Berry Smoothie", 
    image: "https://images.unsplash.com/photo-1553530666-ba11a90061fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVycnklMjBzbW9vdGhpZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
    category: "Beverage",
    time: "5 min",
    description: "Refreshing mixed berry smoothie with yogurt"
  },
  { 
    id: 4, 
    name: "Chicken Curry", 
    image: "https://images.unsplash.com/photo-1604952187418-2bb4312d71ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hpY2tlbiUyMGN1cnJ5fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    category: "Main Course",
    time: "45 min",
    description: "Spicy chicken curry with rich coconut sauce"
  },
  { 
    id: 5, 
    name: "Avocado Toast", 
    image: "https://images.unsplash.com/photo-1588137378633-56c3392811c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZvY2FkbyUyMHRvYXN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    category: "Breakfast",
    time: "10 min",
    description: "Creamy avocado spread on toasted sourdough bread"
  },
  { 
    id: 6, 
    name: "Chocolate Brownie", 
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJvd25pZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
    category: "Dessert",
    time: "40 min",
    description: "Rich, fudgy chocolate brownies with walnuts"
  }
];

const categories = ["All", "Main Course", "Salad", "Breakfast", "Dessert", "Beverage"];

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  
  const filteredRecipes = sampleRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "time") {
      // Simple string comparison for this example
      return a.time.localeCompare(b.time);
    }
    return 0;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recipe Collection</h1>
        <Button asChild>
          <Link to="/recipes/new">
            <Plus className="mr-2 h-4 w-4" /> New Recipe
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <span className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </span>
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Sort By</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Recipe Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("time")}>
                Cooking Time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedRecipes.map(recipe => (
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
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {recipe.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{recipe.time}</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{recipe.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Recipes;
