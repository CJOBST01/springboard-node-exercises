// app.test.js — supertest coverage for the shopping list routes.

const request = require('supertest');
const app = require('./app');
const items = require('./fakeDb');

beforeEach(() => {
  items.length = 0;
  items.push({ name: 'popsicle', price: 1.45 });
});

describe('GET /items', () => {
  test('returns the seed list', async () => {
    const res = await request(app).get('/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ name: 'popsicle', price: 1.45 }]);
  });
});

describe('POST /items', () => {
  test('adds a new item', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'cheerios', price: 3.4 });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ added: { name: 'cheerios', price: 3.4 } });
    expect(items).toHaveLength(2);
  });
  test('400 on bad input', async () => {
    const res = await request(app).post('/items').send({ name: 'x' });
    expect(res.status).toBe(400);
  });
});

describe('GET /items/:name', () => {
  test('returns one item', async () => {
    const res = await request(app).get('/items/popsicle');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: 'popsicle', price: 1.45 });
  });
  test('404 when missing', async () => {
    const res = await request(app).get('/items/nope');
    expect(res.status).toBe(404);
  });
});

describe('PATCH /items/:name', () => {
  test('updates name and price', async () => {
    const res = await request(app)
      .patch('/items/popsicle')
      .send({ name: 'new popsicle', price: 2.45 });
    expect(res.status).toBe(200);
    expect(res.body.updated).toEqual({ name: 'new popsicle', price: 2.45 });
  });
});

describe('DELETE /items/:name', () => {
  test('removes the item', async () => {
    const res = await request(app).delete('/items/popsicle');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' });
    expect(items).toHaveLength(0);
  });
});
