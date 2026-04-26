// models/book.js — minimal Book model backed by Postgres.
//
// Assumes a 'books' table whose columns match the JSONSchema fields. Set
// DATABASE_URL or modify the connection string before running.

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    `postgresql://localhost/${process.env.NODE_ENV === 'test' ? 'books_test' : 'books'}`
});

class Book {
  static async findAll() {
    const result = await pool.query('SELECT * FROM books ORDER BY title');
    return result.rows;
  }

  static async findOne(isbn) {
    const result = await pool.query('SELECT * FROM books WHERE isbn = $1', [isbn]);
    if (result.rows.length === 0) {
      const err = new Error(`Book with isbn '${isbn}' not found`);
      err.status = 404;
      throw err;
    }
    return result.rows[0];
  }

  static async create(book) {
    const { isbn, amazon_url, author, language, pages, publisher, title, year } = book;
    const result = await pool.query(
      `INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [isbn, amazon_url, author, language, pages, publisher, title, year]
    );
    return result.rows[0];
  }

  static async update(isbn, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) {
      return Book.findOne(isbn);
    }
    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(isbn);
    const result = await pool.query(
      `UPDATE books SET ${sets} WHERE isbn = $${values.length} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      const err = new Error(`Book with isbn '${isbn}' not found`);
      err.status = 404;
      throw err;
    }
    return result.rows[0];
  }

  static async remove(isbn) {
    const result = await pool.query('DELETE FROM books WHERE isbn = $1 RETURNING isbn', [isbn]);
    if (result.rows.length === 0) {
      const err = new Error(`Book with isbn '${isbn}' not found`);
      err.status = 404;
      throw err;
    }
  }
}

module.exports = { Book, pool };
