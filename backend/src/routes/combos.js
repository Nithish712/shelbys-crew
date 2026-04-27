const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { verifyAdmin } = require('../middleware/auth');

// GET /api/combos — public
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('combos')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/combos — admin only
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, items, is_available } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Name and price are required.' });
    const { data, error } = await supabase
      .from('combos')
      .insert([{ name, description, price, items: items || [], is_available: is_available ?? true }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/combos/:id — admin only
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, items, is_available } = req.body;
    const { data, error } = await supabase
      .from('combos')
      .update({ name, description, price, items, is_available })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/combos/:id — admin only
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('combos').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
