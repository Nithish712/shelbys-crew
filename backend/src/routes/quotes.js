const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { verifyAdmin } = require('../middleware/auth');

// GET /api/quotes — public (active only)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/quotes/all — admin: all quotes
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/quotes — admin only
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { text, author, is_active } = req.body;
    if (!text) return res.status(400).json({ error: 'Quote text is required.' });
    const { data, error } = await supabase
      .from('quotes')
      .insert([{ text, author: author || 'Tommy Shelby', is_active: is_active ?? true }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/quotes/:id — admin only
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { text, author, is_active } = req.body;
    const { data, error } = await supabase
      .from('quotes')
      .update({ text, author, is_active })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/quotes/:id — admin only
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('quotes').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
