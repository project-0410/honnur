
import { NavLink } from "react-router-dom";
import { 
  Calendar, 
  Home, 
  ShoppingCart, 
  Utensils 
} from "lucide-react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

const Sidebar = () => {
  return (
    <SidebarComponent>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/"
                    className={({isActive}) => 
                      isActive ? "text-primary flex items-center gap-3 font-medium" : "text-gray-600 flex items-center gap-3 hover:text-primary transition-colors"
                    }
                  >
                    <Home size={20} />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/recipes"
                    className={({isActive}) => 
                      isActive ? "text-primary flex items-center gap-3 font-medium" : "text-gray-600 flex items-center gap-3 hover:text-primary transition-colors"
                    }
                  >
                    <Utensils size={20} />
                    <span>Recipes</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/meal-planner"
                    className={({isActive}) => 
                      isActive ? "text-primary flex items-center gap-3 font-medium" : "text-gray-600 flex items-center gap-3 hover:text-primary transition-colors"
                    }
                  >
                    <Calendar size={20} />
                    <span>Meal Planner</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/shopping-list"
                    className={({isActive}) => 
                      isActive ? "text-primary flex items-center gap-3 font-medium" : "text-gray-600 flex items-center gap-3 hover:text-primary transition-colors"
                    }
                  >
                    <ShoppingCart size={20} />
                    <span>Shopping List</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
