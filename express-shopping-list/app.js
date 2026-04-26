// app.js — Express Shopping List server.

const express = require('express');
const itemsRouter = require('./itemsRouter');

const app = express();
app.use(express.json());
app.use('/items', itemsRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message || 'Server error', status: err.status || 500 } });
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Shopping list server running on ${port}`));
}
