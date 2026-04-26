// books.test.js — integration tests for the bookstore.
//
// These mock the Book model so they can run without a Postgres instance.

process.env.NODE_ENV = 'test';

jest.mock('../models/book', () => {
  const store = new Map();
  return {
    Book: {
      findAll: async () => [...store.values()],
      findOne: async isbn => {
        const b = store.get(isbn);
        if (!b) { const e = new Error('not found'); e.status = 404; throw e; }
        return b;
      },
      create: async book => { store.set(book.isbn, book); return book; },
      update: async (isbn, fields) => {
        const cur = store.get(isbn);
        if (!cur) { const e = new Error('not found'); e.status = 404; throw e; }
        const updated = { ...cur, ...fields };
        store.set(isbn, updated);
        return updated;
      },
      remove: async isbn => {
        if (!store.has(isbn)) { const e = new Error('not found'); e.status = 404; throw e; }
        store.delete(isbn);
      }
    },
    pool: { end: async () => undefined }
  };
});

const request = require('supertest');
const app = require('../app');

const sample = {
  isbn: '0691161518',
  amazon_url: 'http://a.co/eobPtX2',
  author: 'Matthew Lane',
  language: 'english',
  pages: 264,
  publisher: 'Princeton University Press',
  title: 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
  year: 2017
};

describe('POST /books', () => {
  test('creates a valid book', async () => {
    const res = await request(app).post('/books').send(sample);
    expect(res.status).toBe(201);
    expect(res.body.book).toEqual(sample);
  });
  test('rejects missing fields with 400', async () => {
    const res = await request(app).post('/books').send({ isbn: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.error.details.length).toBeGreaterThan(0);
  });
});

describe('GET /books and /books/:isbn', () => {
  test('lists books', async () => {
    const res = await request(app).get('/books');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.books)).toBe(true);
  });
  test('returns one by isbn', async () => {
    await request(app).post('/books').send(sample);
    const res = await request(app).get(`/books/${sample.isbn}`);
    expect(res.status).toBe(200);
    expect(res.body.book.isbn).toBe(sample.isbn);
  });
  test('404 on missing isbn', async () => {
    const res = await request(app).get('/books/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('PUT /books/:isbn', () => {
  test('updates a book', async () => {
    await request(app).post('/books').send(sample);
    const res = await request(app).put(`/books/${sample.isbn}`).send({ pages: 300 });
    expect(res.status).toBe(200);
    expect(res.body.book.pages).toBe(300);
  });
  test('rejects unknown fields', async () => {
    await request(app).post('/books').send(sample);
    const res = await request(app).put(`/books/${sample.isbn}`).send({ foo: 'bar' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /books/:isbn', () => {
  test('deletes a book', async () => {
    await request(app).post('/books').send(sample);
    const res = await request(app).delete(`/books/${sample.isbn}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Book deleted' });
  });
});
