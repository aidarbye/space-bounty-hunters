const express = require('express');
const criminalsRouter = require('./routes/criminals');
const huntsRouter = require('./routes/hunts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/criminals', criminalsRouter);
app.use('/api/hunts', huntsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
