
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash } from "lucide-react";

interface GroceryItem {
  id: number;
  name: string;
  completed: boolean;
  category: string;
}

const initialItems: GroceryItem[] = [
  { id: 1, name: "Pasta", completed: false, category: "Dry Goods" },
  { id: 2, name: "Bell pepper", completed: false, category: "Produce" },
  { id: 3, name: "Zucchini", completed: false, category: "Produce" },
  { id: 4, name: "Cherry tomatoes", completed: false, category: "Produce" },
  { id: 5, name: "Heavy cream", completed: false, category: "Dairy" },
  { id: 6, name: "Parmesan cheese", completed: true, category: "Dairy" },
  { id: 7, name: "Olive oil", completed: true, category: "Oils & Vinegars" },
];

const ShoppingList = () => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(initialItems);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Produce");

  const addItem = () => {
    if (newItemName.trim() === "") return;
    
    const newItem: GroceryItem = {
      id: Date.now(),
      name: newItemName.trim(),
      completed: false,
      category: newItemCategory,
    };
    
    setGroceryItems([...groceryItems, newItem]);
    setNewItemName("");
  };

  const toggleItemCompletion = (id: number) => {
    setGroceryItems(
      groceryItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setGroceryItems(groceryItems.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setGroceryItems(groceryItems.filter(item => !item.completed));
  };

  // Group items by category
  const itemsByCategory = groceryItems.reduce<Record<string, GroceryItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  // Sort categories alphabetically
  const categories = Object.keys(itemsByCategory).sort();

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shopping List</h1>
        {groceryItems.some(item => item.completed) && (
          <Button variant="outline" onClick={clearCompleted}>
            Clear completed
          </Button>
        )}
      </div>

      <Card className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add an item..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <select 
            className="rounded-md border border-input bg-background px-3 py-2"
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
          >
            <option value="Produce">Produce</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat">Meat</option>
            <option value="Dry Goods">Dry Goods</option>
            <option value="Frozen">Frozen</option>
            <option value="Canned Goods">Canned Goods</option>
            <option value="Bakery">Bakery</option>
            <option value="Oils & Vinegars">Oils & Vinegars</option>
            <option value="Other">Other</option>
          </select>
          <Button onClick={addItem}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h2 className="text-lg font-semibold mb-2">{category}</h2>
            <Card>
              <ul className="divide-y">
                {itemsByCategory[category].map(item => (
                  <li key={item.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={item.completed} 
                        onCheckedChange={() => toggleItemCompletion(item.id)}
                        id={`item-${item.id}`}
                      />
                      <label 
                        htmlFor={`item-${item.id}`}
                        className={`${item.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {item.name}
                      </label>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ))}

        {groceryItems.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Your shopping list is empty</h3>
            <p className="text-muted-foreground">Add items to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
