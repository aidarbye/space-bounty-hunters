const express = require('express');
const pool = require('../db');
const { parseId, parseBool } = require('../validators');

const router = express.Router();

router.get('/', async (req, res) => {
  const { min_reward, max_reward, sort } = req.query;
  const conditions = [];
  const values = [];

  for (const [key, op] of [['min_reward', '>='], ['max_reward', '<=']]) {
    if (req.query[key] !== undefined) {
      const amount = Number(req.query[key]);
      if (req.query[key] === '' || Number.isNaN(amount)) {
        return res.status(400).json({ error: `${key} must be a number` });
      }
      values.push(amount);
      conditions.push(`reward ${op} $${values.length}`);
    }
  }

  for (const key of ['armed', 'has_crew', 'escape_master']) {
    if (req.query[key] !== undefined) {
      const flag = parseBool(req.query[key]);
      if (flag === null) {
        return res.status(400).json({ error: `${key} must be true or false` });
      }
      values.push(flag);
      conditions.push(`${key} = $${values.length}`);
    }
  }

  let query = 'SELECT * FROM criminals';
  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  if (sort === undefined) {
    query += ' ORDER BY id';
  } else if (sort === 'reward') {
    query += ' ORDER BY reward ASC';
  } else if (sort === '-reward') {
    query += ' ORDER BY reward DESC';
  } else {
    return res.status(400).json({ error: 'sort must be reward or -reward' });
  }

  const result = await pool.query(query, values);
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const result = await pool.query('SELECT * FROM criminals WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Criminal not found' });
  }
  res.json(result.rows[0]);
});

module.exports = router;
