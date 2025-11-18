import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all categories with search and filter
router.get('/', async (req, res, next) => {
  try {
    const { search, active } = req.query;
    let query = 'SELECT * FROM categories WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (code LIKE ? OR name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (active !== undefined) {
      query += ' AND is_active = ?';
      params.push(active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY sort_order, name';

    const categories = await db.all(query, params);
    res.json(categories || []);
  } catch (error) {
    console.error('Error fetching categories:', error);
    next(error);
  }
});

// GET category with subcategories
router.get('/:id/subcategories', async (req, res, next) => {
  try {
    const { id } = req.params;
    const subcategories = await db.all(
      'SELECT * FROM subcategories WHERE category_id = ? ORDER BY sort_order, name',
      [id]
    );
    res.json(subcategories || []);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    next(error);
  }
});

// GET category with all price items
router.get('/:id/items', async (req, res, next) => {
  try {
    const { id } = req.params;
    const items = await db.all(
      'SELECT * FROM price_list_master WHERE category_id = ? ORDER BY code',
      [id]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching category items:', error);
    next(error);
  }
});

// GET single category by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await db.get('SELECT * FROM categories WHERE id = ?', [id]);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    next(error);
  }
});

// CREATE new category
router.post('/', async (req, res, next) => {
  try {
    const { code, name, description, sort_order, is_active } = req.body;

    const result = await db.run(
      `INSERT INTO categories (code, name, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?)`,
      [code, name, description || null, sort_order || 0, is_active !== undefined ? is_active : 1]
    );

    const newCategory = await db.get('SELECT * FROM categories WHERE id = ?', [result.lastID]);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    next(error);
  }
});

// UPDATE category
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, name, description, sort_order, is_active } = req.body;

    await db.run(
      `UPDATE categories SET code = ?, name = ?, description = ?, sort_order = ?, is_active = ? WHERE id = ?`,
      [code, name, description, sort_order, is_active, id]
    );

    const updatedCategory = await db.get('SELECT * FROM categories WHERE id = ?', [id]);
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    next(error);
  }
});

// DELETE category
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if category has items
    const itemCount = await db.get('SELECT COUNT(*) as count FROM price_list_master WHERE category_id = ?', [id]);
    if (itemCount.count > 0) {
      return res.status(400).json({ error: 'Cannot delete category with existing price items' });
    }

    await db.run('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully', id });
  } catch (error) {
    console.error('Error deleting category:', error);
    next(error);
  }
});

export default router;
