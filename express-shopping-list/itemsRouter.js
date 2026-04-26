// itemsRouter.js — Express Router for shopping list items.

const express = require('express');
const items = require('./fakeDb');

const router = new express.Router();

function findItem(name) {
  return items.find(i => i.name === name);
}

router.get('/', (req, res) => {
  res.json(items);
});

router.post('/', (req, res, next) => {
  const { name, price } = req.body || {};
  if (typeof name !== 'string' || typeof price !== 'number') {
    return next({ status: 400, message: 'name (string) and price (number) are required' });
  }
  const newItem = { name, price };
  items.push(newItem);
  res.status(201).json({ added: newItem });
});

router.get('/:name', (req, res, next) => {
  const item = findItem(req.params.name);
  if (!item) return next({ status: 404, message: 'Item not found' });
  res.json(item);
});

router.patch('/:name', (req, res, next) => {
  const item = findItem(req.params.name);
  if (!item) return next({ status: 404, message: 'Item not found' });
  const { name, price } = req.body || {};
  if (name !== undefined) item.name = name;
  if (price !== undefined) item.price = price;
  res.json({ updated: item });
});

router.delete('/:name', (req, res, next) => {
  const idx = items.findIndex(i => i.name === req.params.name);
  if (idx === -1) return next({ status: 404, message: 'Item not found' });
  items.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
