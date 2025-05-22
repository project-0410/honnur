
const express = require('express');
const cors = require('cors');
const mealPlannerRoutes = require('./routes/mealPlanner');
const recipeRoutes = require('./routes/recipes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/meal-planner', mealPlannerRoutes);
app.use('/api/recipes', recipeRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('FreshMeal Planner API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
