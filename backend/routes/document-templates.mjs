import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all document templates
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM document_templates ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching document templates:', error);
    next(error);
  }
});

// GET single document template by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM document_templates WHERE id = ?', [id]);

    if (!item) {
      return res.status(404).json({ error: 'Document template not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching document template:', error);
    next(error);
  }
});

// GET document templates by type
router.get('/type/:templateType', async (req, res, next) => {
  try {
    const { templateType } = req.params;
    const items = await db.all(
      'SELECT * FROM document_templates WHERE template_type = ? ORDER BY id DESC',
      [templateType]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching document templates by type:', error);
    next(error);
  }
});

// GET default document template by type
router.get('/default/:templateType', async (req, res, next) => {
  try {
    const { templateType } = req.params;
    const item = await db.get(
      'SELECT * FROM document_templates WHERE template_type = ? AND is_default = 1',
      [templateType]
    );

    if (!item) {
      return res.status(404).json({ error: 'Default document template not found for this type' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching default document template:', error);
    next(error);
  }
});

// CREATE new document template
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['template_name', 'template_type', 'html_content', 'css_styles', 'is_default'];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);

    // If this is set as default, unset any other defaults for this template type
    if (data.is_default) {
      await db.run(
        'UPDATE document_templates SET is_default = 0 WHERE template_type = ?',
        [data.template_type]
      );
    }

    const result = await db.run(
      `INSERT INTO document_templates (${fields.join(', ')})
       VALUES (?, ?, ?, ?, ?)`,
      values
    );

    const newItem = await db.get('SELECT * FROM document_templates WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating document template:', error);
    next(error);
  }
});

// UPDATE document template
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['template_name', 'template_type', 'html_content', 'css_styles', 'is_default'];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);
    values.push(id);

    // If this is set as default, unset any other defaults for this template type
    if (data.is_default) {
      await db.run(
        'UPDATE document_templates SET is_default = 0 WHERE template_type = ? AND id != ?',
        [data.template_type, id]
      );
    }

    await db.run(
      `UPDATE document_templates SET
       template_name = ?, template_type = ?, html_content = ?, css_styles = ?, is_default = ?
       WHERE id = ?`,
      values
    );

    const updatedItem = await db.get('SELECT * FROM document_templates WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating document template:', error);
    next(error);
  }
});

// Set template as default
router.patch('/:id/set-default', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get the template to find its type
    const template = await db.get('SELECT * FROM document_templates WHERE id = ?', [id]);

    if (!template) {
      return res.status(404).json({ error: 'Document template not found' });
    }

    // Unset any other defaults for this template type
    await db.run(
      'UPDATE document_templates SET is_default = 0 WHERE template_type = ?',
      [template.template_type]
    );

    // Set this one as default
    await db.run(
      'UPDATE document_templates SET is_default = 1 WHERE id = ?',
      [id]
    );

    const updatedItem = await db.get('SELECT * FROM document_templates WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error setting default document template:', error);
    next(error);
  }
});

// DELETE document template
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM document_templates WHERE id = ?', [id]);
    res.json({ message: 'Document template deleted successfully', id });
  } catch (error) {
    console.error('Error deleting document template:', error);
    next(error);
  }
});

export default router;
