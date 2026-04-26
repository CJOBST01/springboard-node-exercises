// step3.js — read a file or URL, optionally write the result to a file.
// Usage: node step3.js [--out FILENAME] <path-or-url>

const fs = require('fs');
const axios = require('axios');

function isUrl(s) {
  return /^https?:\/\//i.test(s);
}

function handleOutput(text, outFile) {
  if (!outFile) {
    console.log(text);
    return;
  }
  fs.writeFile(outFile, text, err => {
    if (err) {
      console.error(`Couldn't write ${outFile}: ${err}`);
      process.exit(1);
    }
  });
}

async function readSource(source) {
  if (isUrl(source)) {
    try {
      const res = await axios.get(source);
      return typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
    } catch (err) {
      console.error(`Error fetching ${source}: ${err}`);
      process.exit(1);
    }
  }
  return new Promise((resolve, reject) => {
    fs.readFile(source, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading ${source}: ${err}`);
        process.exit(1);
      }
      resolve(data);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  let outFile = null;
  let source = null;

  if (args[0] === '--out') {
    outFile = args[1];
    source = args[2];
  } else {
    source = args[0];
  }

  if (!source) {
    console.error('Usage: node step3.js [--out FILENAME] <path-or-url>');
    process.exit(1);
  }

  const text = await readSource(source);
  handleOutput(text, outFile);
}

main();
