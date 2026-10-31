const express = require('express');
const pool = require('../db');
const { parseId } = require('../validators');

const router = express.Router();

router.get('/', async (req, res) => {
  if (req.query.criminal_id === undefined) {
    const result = await pool.query('SELECT * FROM hunt_logs ORDER BY id');
    return res.json(result.rows);
  }
  const criminalId = parseId(req.query.criminal_id);
  if (!criminalId) {
    return res.status(400).json({ error: 'Invalid criminal_id' });
  }
  const result = await pool.query(
    'SELECT * FROM hunt_logs WHERE criminal_id = $1 ORDER BY id',
    [criminalId]
  );
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const result = await pool.query('SELECT * FROM hunt_logs WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Hunt log not found' });
  }
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const { criminal_id, success, notes } = req.body ?? {};
  if (!Number.isInteger(criminal_id) || criminal_id <= 0) {
    return res.status(400).json({ error: 'criminal_id must be a positive integer' });
  }
  if (typeof success !== 'boolean') {
    return res.status(400).json({ error: 'success must be a boolean' });
  }
  if (notes !== undefined && typeof notes !== 'string') {
    return res.status(400).json({ error: 'notes must be a string' });
  }
  const criminal = await pool.query('SELECT id FROM criminals WHERE id = $1', [criminal_id]);
  if (criminal.rows.length === 0) {
    return res.status(404).json({ error: 'Criminal not found' });
  }
  const result = await pool.query(
    'INSERT INTO hunt_logs (criminal_id, success, notes) VALUES ($1, $2, $3) RETURNING *',
    [criminal_id, success, notes ?? null]
  );
  res.status(201).json(result.rows[0]);
});

router.patch('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const { success, notes } = req.body ?? {};
  if (success === undefined && notes === undefined) {
    return res.status(400).json({ error: 'Provide success or notes' });
  }
  if (success !== undefined && typeof success !== 'boolean') {
    return res.status(400).json({ error: 'success must be a boolean' });
  }
  if (notes !== undefined && typeof notes !== 'string') {
    return res.status(400).json({ error: 'notes must be a string' });
  }
  const result = await pool.query(
    'UPDATE hunt_logs SET success = COALESCE($1, success), notes = COALESCE($2, notes) WHERE id = $3 RETURNING *',
    [success ?? null, notes ?? null, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Hunt log not found' });
  }
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const result = await pool.query('DELETE FROM hunt_logs WHERE id = $1 RETURNING id', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Hunt log not found' });
  }
  res.status(204).send();
});

module.exports = router;
