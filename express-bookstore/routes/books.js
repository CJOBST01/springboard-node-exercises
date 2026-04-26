// routes/books.js — REST routes for the books resource with JSONSchema validation.

const express = require('express');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { Book } = require('../models/book');
const { bookSchema, bookPatchSchema } = require('../schemas/bookSchema');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateCreate = ajv.compile(bookSchema);
const validateUpdate = ajv.compile(bookPatchSchema);

const router = new express.Router();

function validationError(errors) {
  const err = new Error('Validation failed');
  err.status = 400;
  err.details = errors.map(e => `${e.instancePath || e.dataPath || ''} ${e.message}`.trim());
  return err;
}

router.get('/', async (req, res, next) => {
  try { res.json({ books: await Book.findAll() }); }
  catch (err) { next(err); }
});

router.get('/:isbn', async (req, res, next) => {
  try { res.json({ book: await Book.findOne(req.params.isbn) }); }
  catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    if (!validateCreate(req.body)) return next(validationError(validateCreate.errors));
    const book = await Book.create(req.body);
    res.status(201).json({ book });
  } catch (err) { next(err); }
});

router.put('/:isbn', async (req, res, next) => {
  try {
    if (!validateUpdate(req.body)) return next(validationError(validateUpdate.errors));
    const book = await Book.update(req.params.isbn, req.body);
    res.json({ book });
  } catch (err) { next(err); }
});

router.delete('/:isbn', async (req, res, next) => {
  try {
    await Book.remove(req.params.isbn);
    res.json({ message: 'Book deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
