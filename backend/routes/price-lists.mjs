/**
 * Price Lists and Price List Items Routes
 * Enhanced with regional support and search
 */

import express from 'express';
import db from '../db.js';

const router = express.Router();

// ============================================
// PRICE LISTS
// ============================================

// GET all price lists
router.get('/', async (req, res, next) => {
  try {
    const priceLists = await db.all(
      'SELECT * FROM price_lists ORDER BY is_active DESC, name'
    );
    res.json(priceLists || []);
  } catch (error) {
    console.error('Error fetching price lists:', error);
    next(error);
  }
});

// GET active price list
router.get('/active', async (req, res, next) => {
  try {
    const priceList = await db.get(
      'SELECT * FROM price_lists WHERE is_active = 1 LIMIT 1'
    );
    res.json(priceList || null);
  } catch (error) {
    console.error('Error fetching active price list:', error);
    next(error);
  }
});

// ============================================
// PRICE LIST ITEMS - SEARCH & FILTER
// ============================================

// SEARCH price list items
router.get('/items/search', async (req, res, next) => {
  try {
    const {
      q = '',           // search query
      category,         // filter by category
      price_list_id,    // filter by price list
      limit = 50
    } = req.query;

    let query = `
      SELECT pli.*, pl.name as price_list_name, pl.region
      FROM price_list_items pli
      JOIN price_lists pl ON pli.price_list_id = pl.id
      WHERE pl.is_active = 1
    `;
    const params = [];

    // Search in code, description, or category
    if (q) {
      query += ' AND (pli.code LIKE ? OR pli.description LIKE ? OR pli.category LIKE ?)';
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Filter by category
    if (category) {
      query += ' AND pli.category = ?';
      params.push(category);
    }

    // Filter by price list
    if (price_list_id) {
      query += ' AND pli.price_list_id = ?';
      params.push(price_list_id);
    }

    query += ' ORDER BY pli.category, pli.description LIMIT ?';
    params.push(parseInt(limit));

    const items = await db.all(query, params);
    res.json(items || []);
  } catch (error) {
    console.error('Error searching price list items:', error);
    next(error);
  }
});

// GET all categories from price list items
router.get('/items/categories', async (req, res, next) => {
  try {
    const categories = await db.all(
      `SELECT DISTINCT category
       FROM price_list_items
       WHERE category IS NOT NULL
       ORDER BY category`
    );
    res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    next(error);
  }
});

// GET items by code (exact match)
router.get('/items/by-code/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const item = await db.get(
      `SELECT pli.*, pl.name as price_list_name, pl.region
       FROM price_list_items pli
       JOIN price_lists pl ON pli.price_list_id = pl.id
       WHERE pli.code = ? AND pl.is_active = 1
       LIMIT 1`,
      [code.toUpperCase()]
    );

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item by code:', error);
    next(error);
  }
});

// GET all items for a specific price list
router.get('/:priceListId/items', async (req, res, next) => {
  try {
    const { priceListId } = req.params;
    const { category, limit = 100 } = req.query;

    let query = 'SELECT * FROM price_list_items WHERE price_list_id = ?';
    const params = [priceListId];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY category, description LIMIT ?';
    params.push(parseInt(limit));

    const items = await db.all(query, params);
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching price list items:', error);
    next(error);
  }
});

// CREATE price list item
router.post('/:priceListId/items', async (req, res, next) => {
  try {
    const { priceListId } = req.params;
    const { code, category, subcategory, description, unit, unit_price, labor_rate, material_cost, equipment_cost, notes } = req.body;

    const result = await db.run(
      `INSERT INTO price_list_items
       (price_list_id, code, category, subcategory, description, unit, unit_price, labor_rate, material_cost, equipment_cost, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [priceListId, code?.toUpperCase(), category, subcategory, description, unit || 'EA', unit_price || 0, labor_rate || 0, material_cost || 0, equipment_cost || 0, notes]
    );

    const newItem = await db.get('SELECT * FROM price_list_items WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating price list item:', error);
    next(error);
  }
});

// UPDATE price list item
router.put('/items/:itemId', async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { code, category, subcategory, description, unit, unit_price, labor_rate, material_cost, equipment_cost, notes } = req.body;

    await db.run(
      `UPDATE price_list_items
       SET code = ?, category = ?, subcategory = ?, description = ?, unit = ?,
           unit_price = ?, labor_rate = ?, material_cost = ?, equipment_cost = ?, notes = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [code?.toUpperCase(), category, subcategory, description, unit, unit_price, labor_rate, material_cost, equipment_cost, notes, itemId]
    );

    const updatedItem = await db.get('SELECT * FROM price_list_items WHERE id = ?', [itemId]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating price list item:', error);
    next(error);
  }
});

// DELETE price list item
router.delete('/items/:itemId', async (req, res, next) => {
  try {
    const { itemId } = req.params;
    await db.run('DELETE FROM price_list_items WHERE id = ?', [itemId]);
    res.json({ message: 'Price list item deleted successfully' });
  } catch (error) {
    console.error('Error deleting price list item:', error);
    next(error);
  }
});

export default router;
