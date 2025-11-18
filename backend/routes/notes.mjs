import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all notes
router.get('/', async (req, res, next) => {
  try {
    const notes = await db.all('SELECT * FROM notes ORDER BY created_at DESC');
    res.json(notes || []);
  } catch (error) {
    console.error('Error fetching notes:', error);
    next(error);
  }
});

// GET single note by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await db.get('SELECT * FROM notes WHERE id = ?', [id]);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    next(error);
  }
});

// CREATE new note
router.post('/', async (req, res, next) => {
  try {
    const { title, content, category, priority } = req.body;

    const result = await db.run(
      `INSERT INTO notes (title, content, category, priority) VALUES (?, ?, ?, ?)`,
      [title, content, category || 'general', priority || 'normal']
    );

    const newNote = await db.get('SELECT * FROM notes WHERE id = ?', [result ? result.lastID : 1]);
    if (!newNote) {
      // If result.lastID doesn't work, get the latest note
      const latestNote = await db.get('SELECT * FROM notes ORDER BY id DESC LIMIT 1');
      res.status(201).json(latestNote);
    } else {
      res.status(201).json(newNote);
    }
  } catch (error) {
    console.error('Error creating note:', error);
    next(error);
  }
});

// UPDATE note
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category, priority } = req.body;

    await db.run(
      `UPDATE notes SET title = ?, content = ?, category = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, content, category, priority, id]
    );

    const updatedNote = await db.get('SELECT * FROM notes WHERE id = ?', [id]);
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    next(error);
  }
});

// DELETE note
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM notes WHERE id = ?', [id]);
    res.json({ message: 'Note deleted successfully', id });
  } catch (error) {
    console.error('Error deleting note:', error);
    next(error);
  }
});

export default router;
