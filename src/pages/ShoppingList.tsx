
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash } from "lucide-react";
import { storageService, ShoppingItem } from "@/services/storage";
import { useToast } from "@/hooks/use-toast";

const ShoppingList = () => {
  const [groceryItems, setGroceryItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Produce");
  const { toast } = useToast();

  useEffect(() => {
    loadShoppingList();
  }, []);

  const loadShoppingList = () => {
    const items = storageService.getShoppingList();
    setGroceryItems(items);
  };

  const addItem = () => {
    if (newItemName.trim() === "") return;
    
    storageService.addShoppingItem(newItemName, newItemCategory);
    loadShoppingList();
    setNewItemName("");
    
    toast({
      title: "Item Added",
      description: `${newItemName} has been added to your shopping list.`,
    });
  };

  const toggleItemCompletion = (id: number) => {
    const item = groceryItems.find(item => item.id === id);
    if (item) {
      storageService.updateShoppingItem(id, { completed: !item.completed });
      loadShoppingList();
    }
  };

  const removeItem = (id: number) => {
    const item = groceryItems.find(item => item.id === id);
    storageService.deleteShoppingItem(id);
    loadShoppingList();
    
    if (item) {
      toast({
        title: "Item Removed",
        description: `${item.name} has been removed from your shopping list.`,
      });
    }
  };

  const clearCompleted = () => {
    storageService.clearCompletedShoppingItems();
    loadShoppingList();
    
    toast({
      title: "Completed Items Cleared",
      description: "All completed items have been removed from your shopping list.",
    });
  };

  // Group items by category
  const itemsByCategory = groceryItems.reduce<Record<string, ShoppingItem[]>>(
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
