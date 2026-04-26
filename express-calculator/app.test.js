// app.test.js — supertest-driven unit tests for the calculator routes.

const request = require('supertest');
const { app, mean, median, mode } = require('./app');

describe('pure helpers', () => {
  test('mean', () => { expect(mean([1, 3, 5, 7])).toBe(4); });
  test('median odd', () => { expect(median([1, 3, 5])).toBe(3); });
  test('median even', () => { expect(median([1, 3, 5, 7])).toBe(4); });
  test('mode', () => { expect(mode([1, 2, 2, 3])).toBe(2); });
});

describe('GET /mean', () => {
  test('returns the average', async () => {
    const res = await request(app).get('/mean?nums=1,3,5,7');
    expect(res.status).toBe(200);
    expect(res.body.response).toEqual({ operation: 'mean', value: 4 });
  });
  test('400 on missing nums', async () => {
    const res = await request(app).get('/mean');
    expect(res.status).toBe(400);
  });
  test('400 on a non-number', async () => {
    const res = await request(app).get('/mean?nums=foo,2,3');
    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/foo is not a number/);
  });
});

describe('GET /median', () => {
  test('returns the midpoint', async () => {
    const res = await request(app).get('/median?nums=1,3,5,7');
    expect(res.status).toBe(200);
    expect(res.body.response.value).toBe(4);
  });
});

describe('GET /mode', () => {
  test('returns the most-frequent value', async () => {
    const res = await request(app).get('/mode?nums=1,2,2,3');
    expect(res.status).toBe(200);
    expect(res.body.response.value).toBe(2);
  });
});

describe('GET /all', () => {
  test('returns all three operations', async () => {
    const res = await request(app).get('/all?nums=1,2,2,3,4');
    expect(res.status).toBe(200);
    expect(res.body.response.operation).toBe('all');
    expect(res.body.response).toHaveProperty('mean');
    expect(res.body.response).toHaveProperty('median');
    expect(res.body.response).toHaveProperty('mode');
  });
});
