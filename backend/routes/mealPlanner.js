
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get meal types
router.get('/meal-types', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM meal_types');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching meal types:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get meal plans for a user
router.get('/plans/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT pm.*, r.title as recipe_name, mt.name as meal_type_name FROM planned_meals pm ' +
                'JOIN recipes r ON pm.recipe_id = r.recipe_id ' +
                'JOIN meal_types mt ON pm.meal_type_id = mt.type_id ' +
                'JOIN meal_plans mp ON pm.plan_id = mp.plan_id ' +
                'WHERE mp.user_id = ? ';
    
    const params = [userId];
    
    if (startDate && endDate) {
      query += 'AND pm.day_date BETWEEN ? AND ? ';
      params.push(startDate, endDate);
    }
    
    query += 'ORDER BY pm.day_date, mt.type_id';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get default plan for a user
router.get('/default-plan/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM meal_plans WHERE user_id = ? AND is_default = 1',
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Default plan not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching default plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a planned meal
router.post('/planned-meals', async (req, res) => {
  try {
    const { planId, recipeId, mealTypeId, dayDate, servings } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO planned_meals (plan_id, recipe_id, meal_type_id, day_date, servings) VALUES (?, ?, ?, ?, ?)',
      [planId, recipeId, mealTypeId, dayDate, servings || 1]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      planId,
      recipeId,
      mealTypeId,
      dayDate,
      servings
    });
  } catch (error) {
    console.error('Error adding planned meal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a planned meal
router.delete('/planned-meals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      'DELETE FROM planned_meals WHERE planned_meal_id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Planned meal not found' });
    }
    
    res.json({ message: 'Planned meal removed successfully' });
  } catch (error) {
    console.error('Error removing planned meal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
