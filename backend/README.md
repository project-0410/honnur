
# FreshMeal Planner Backend API

This is the backend API for the FreshMeal Planner application. It provides endpoints for managing meal plans, recipes, and user data.

## Setup

1. Make sure you have Node.js and MySQL installed on your system
2. Create a MySQL database named `freshmeal_planner`
3. Import the database schema from `../database/meal_planner_schema.sql`
4. Update database connection details in `config.js` if needed
5. Install dependencies:

```bash
cd backend
npm install
```

## Running the server

```bash
# Start in development mode with auto-restart
npm run dev

# Start in production mode
npm start
```

The server will run on port 5000 by default. You can change this by setting the PORT environment variable.

## API Endpoints

### Meal Planner

- `GET /api/meal-planner/meal-types` - Get all meal types
- `GET /api/meal-planner/plans/:userId` - Get meal plans for a user
- `GET /api/meal-planner/default-plan/:userId` - Get default plan for a user
- `POST /api/meal-planner/planned-meals` - Add a planned meal
- `DELETE /api/meal-planner/planned-meals/:id` - Remove a planned meal

### Recipes

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get recipe by ID
- `GET /api/recipes/category/:categoryId` - Get recipes by category
