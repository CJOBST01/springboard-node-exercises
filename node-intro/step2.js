// step2.js — read a file or URL and print its contents.
// Usage: node step2.js <path-or-url>

const fs = require('fs');
const axios = require('axios');

function cat(path) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${path}: ${err}`);
      process.exit(1);
    }
    console.log(data);
  });
}

async function webCat(url) {
  try {
    const res = await axios.get(url);
    console.log(res.data);
  } catch (err) {
    console.error(`Error fetching ${url}: ${err}`);
    process.exit(1);
  }
}

function isUrl(s) {
  return /^https?:\/\//i.test(s);
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node step2.js <path-or-url>');
  process.exit(1);
}
if (isUrl(arg)) webCat(arg); else cat(arg);
