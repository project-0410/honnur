
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM recipes');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM recipes WHERE recipe_id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recipes by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM recipes WHERE category_id = ?',
      [categoryId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
