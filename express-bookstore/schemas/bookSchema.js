// schemas/bookSchema.js — JSONSchema definitions for create and update.

const bookSchema = {
  type: 'object',
  required: ['isbn', 'amazon_url', 'author', 'language', 'pages', 'publisher', 'title', 'year'],
  properties: {
    isbn:        { type: 'string', minLength: 1 },
    amazon_url:  { type: 'string', format: 'uri' },
    author:      { type: 'string', minLength: 1 },
    language:    { type: 'string', minLength: 1 },
    pages:       { type: 'integer', minimum: 1 },
    publisher:   { type: 'string', minLength: 1 },
    title:       { type: 'string', minLength: 1 },
    year:        { type: 'integer', minimum: 1450, maximum: 2100 }
  },
  additionalProperties: false
};

const bookPatchSchema = {
  type: 'object',
  properties: bookSchema.properties,
  additionalProperties: false,
  minProperties: 1
};

module.exports = { bookSchema, bookPatchSchema };
