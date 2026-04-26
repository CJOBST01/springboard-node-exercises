// step1.js — read a local file and print its contents.
// Usage: node step1.js path/to/file

const fs = require('fs');

function cat(path) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${path}: ${err}`);
      process.exit(1);
    }
    console.log(data);
  });
}

const path = process.argv[2];
if (!path) {
  console.error('Usage: node step1.js <path>');
  process.exit(1);
}
cat(path);
