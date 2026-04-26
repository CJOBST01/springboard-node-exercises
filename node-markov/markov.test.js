// markov.test.js — basic deterministic tests for MarkovMachine.
//   npm test

const { MarkovMachine } = require('./markov');

describe('MarkovMachine', () => {
  test('builds chains for a known phrase', () => {
    const mm = new MarkovMachine('the cat in the hat');
    expect(mm.chains.get('the').sort()).toEqual(['cat', 'hat']);
    expect(mm.chains.get('cat')).toEqual(['in']);
    expect(mm.chains.get('in')).toEqual(['the']);
    expect(mm.chains.get('hat')).toEqual([null]);
  });

  test('makeText respects numWords cap', () => {
    const mm = new MarkovMachine('one two three four five');
    const out = mm.makeText(3).split(' ');
    expect(out.length).toBeLessThanOrEqual(3);
  });

  test('every word in output is from the source vocabulary', () => {
    const source = 'alpha beta gamma delta epsilon';
    const vocab = new Set(source.split(' '));
    const mm = new MarkovMachine(source);
    const out = mm.makeText(20).split(' ');
    for (const word of out) {
      expect(vocab.has(word)).toBe(true);
    }
  });
});
