// app.js — Express Bookstore server.

const express = require('express');
const books = require('./routes/books');

const app = express();
app.use(express.json());
app.use('/books', books);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500,
      details: err.details || undefined
    }
  });
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Bookstore running on ${port}`));
}
