// app.js — Express Calculator routes for mean/median/mode/all.

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

function parseNums(query) {
  if (!query.nums) {
    const err = new Error('nums are required');
    err.status = 400;
    throw err;
  }
  const raw = String(query.nums).split(',');
  const nums = [];
  for (const r of raw) {
    const n = Number(r);
    if (!Number.isFinite(n)) {
      const err = new Error(`${r} is not a number`);
      err.status = 400;
      throw err;
    }
    nums.push(n);
  }
  return nums;
}

function mean(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function mode(nums) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  let best = nums[0];
  let bestCount = 0;
  for (const [n, count] of freq) {
    if (count > bestCount) { best = n; bestCount = count; }
  }
  return best;
}

function maybeSave(payload, save) {
  if (save !== 'true') return;
  const out = { ...payload, timestamp: new Date().toISOString() };
  fs.writeFileSync(
    path.join(__dirname, 'results.json'),
    JSON.stringify(out, null, 2)
  );
}

function respond(req, res, payload) {
  maybeSave(payload, req.query.save);
  if (req.accepts(['html', 'json']) === 'html') {
    return res.send(`<pre>${JSON.stringify(payload, null, 2)}</pre>`);
  }
  res.json({ response: payload });
}

app.get('/mean', (req, res, next) => {
  try {
    const nums = parseNums(req.query);
    respond(req, res, { operation: 'mean', value: mean(nums) });
  } catch (e) { next(e); }
});

app.get('/median', (req, res, next) => {
  try {
    const nums = parseNums(req.query);
    respond(req, res, { operation: 'median', value: median(nums) });
  } catch (e) { next(e); }
});

app.get('/mode', (req, res, next) => {
  try {
    const nums = parseNums(req.query);
    respond(req, res, { operation: 'mode', value: mode(nums) });
  } catch (e) { next(e); }
});

app.get('/all', (req, res, next) => {
  try {
    const nums = parseNums(req.query);
    respond(req, res, {
      operation: 'all',
      mean: mean(nums),
      median: median(nums),
      mode: mode(nums)
    });
  } catch (e) { next(e); }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message, status: err.status || 500 } });
});

module.exports = { app, mean, median, mode };

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Express Calculator listening on ${port}`));
}
