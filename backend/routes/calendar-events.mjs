import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all calendar events
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM calendar_events ORDER BY event_date DESC, start_time DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    next(error);
  }
});

// GET single calendar event by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM calendar_events WHERE id = ?', [id]);

    if (!item) {
      return res.status(404).json({ error: 'Calendar event not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching calendar event:', error);
    next(error);
  }
});

// GET calendar events by date range
router.get('/range/:startDate/:endDate', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.params;
    const items = await db.all(
      'SELECT * FROM calendar_events WHERE event_date BETWEEN ? AND ? ORDER BY event_date, start_time',
      [startDate, endDate]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching calendar events by range:', error);
    next(error);
  }
});

// GET calendar events by client ID
router.get('/client/:clientId', async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const items = await db.all(
      'SELECT * FROM calendar_events WHERE client_id = ? ORDER BY event_date DESC',
      [clientId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching calendar events for client:', error);
    next(error);
  }
});

// GET calendar events by work order ID
router.get('/work-order/:workOrderId', async (req, res, next) => {
  try {
    const { workOrderId } = req.params;
    const items = await db.all(
      'SELECT * FROM calendar_events WHERE work_order_id = ? ORDER BY event_date DESC',
      [workOrderId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching calendar events for work order:', error);
    next(error);
  }
});

// GET calendar events assigned to employee
router.get('/assigned/:employeeId', async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const items = await db.all(
      'SELECT * FROM calendar_events WHERE assigned_to = ? ORDER BY event_date DESC',
      [employeeId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching calendar events for employee:', error);
    next(error);
  }
});

// GET upcoming calendar events
router.get('/upcoming/all', async (req, res, next) => {
  try {
    const items = await db.all(
      `SELECT * FROM calendar_events
       WHERE event_date >= date('now')
       ORDER BY event_date, start_time
       LIMIT 50`
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching upcoming calendar events:', error);
    next(error);
  }
});

// CREATE new calendar event
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = [
      'title', 'description', 'event_type', 'event_date', 'start_time',
      'end_time', 'client_id', 'work_order_id', 'assigned_to', 'location',
      'status', 'reminder_sent', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);

    const result = await db.run(
      `INSERT INTO calendar_events (${fields.join(', ')})
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    const newItem = await db.get('SELECT * FROM calendar_events WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    next(error);
  }
});

// UPDATE calendar event
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = [
      'title', 'description', 'event_type', 'event_date', 'start_time',
      'end_time', 'client_id', 'work_order_id', 'assigned_to', 'location',
      'status', 'reminder_sent', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);
    values.push(id);

    await db.run(
      `UPDATE calendar_events SET
       title = ?, description = ?, event_type = ?, event_date = ?, start_time = ?,
       end_time = ?, client_id = ?, work_order_id = ?, assigned_to = ?, location = ?,
       status = ?, reminder_sent = ?, notes = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      values
    );

    const updatedItem = await db.get('SELECT * FROM calendar_events WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    next(error);
  }
});

// DELETE calendar event
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM calendar_events WHERE id = ?', [id]);
    res.json({ message: 'Calendar event deleted successfully', id });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    next(error);
  }
});

export default router;
