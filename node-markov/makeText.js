// makeText.js — generate text from a file or URL using a Markov chain.
// Usage:
//   node makeText.js file <path>
//   node makeText.js url <url>

const fs = require('fs');
const axios = require('axios');
const { MarkovMachine } = require('./markov');

async function readSource(kind, source) {
  if (kind === 'file') {
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
  if (kind === 'url') {
    try {
      const res = await axios.get(source);
      return typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
    } catch (err) {
      console.error(`Error fetching ${source}: ${err}`);
      process.exit(1);
    }
  }
  console.error('First argument must be "file" or "url".');
  process.exit(1);
}

async function main() {
  const [kind, source] = process.argv.slice(2);
  if (!kind || !source) {
    console.error('Usage: node makeText.js [file|url] <source>');
    process.exit(1);
  }
  const text = await readSource(kind, source);
  const mm = new MarkovMachine(text);
  console.log(mm.makeText());
}

main();
