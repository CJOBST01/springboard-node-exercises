/** Textual Markov chain generator. */

class MarkovMachine {
  /** build markov machine; read in text. */
  constructor(text) {
    const words = text.split(/[ \r\n]+/).filter(c => c !== '');
    this.words = words;
    this.chains = new Map();
    this.makeChains();
  }

  /**
   * Build the chains map.
   *
   * For text of "the cat in the hat", chains will be
   * { the: ['cat', 'hat'], cat: ['in'], in: ['the'], hat: [null] }
   */
  makeChains() {
    for (let i = 0; i < this.words.length; i++) {
      const word = this.words[i];
      const next = i + 1 < this.words.length ? this.words[i + 1] : null;
      if (!this.chains.has(word)) this.chains.set(word, []);
      this.chains.get(word).push(next);
    }
  }

  /** Pick a random element from an array. */
  static pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /** Return random text of up to numWords words. */
  makeText(numWords = 100) {
    if (this.words.length === 0) return '';
    let current = MarkovMachine.pick(this.words);
    const out = [];
    while (current !== null && out.length < numWords) {
      out.push(current);
      const nexts = this.chains.get(current);
      current = nexts ? MarkovMachine.pick(nexts) : null;
    }
    return out.join(' ');
  }
}

module.exports = { MarkovMachine };
