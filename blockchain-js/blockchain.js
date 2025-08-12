const crypto = require('crypto');

class Block {
  constructor(index, timestamp, amount, prevHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.amount = amount;
    this.prevHash = prevHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256').update(
      this.index + this.timestamp + this.amount + this.prevHash + this.nonce
    ).digest('hex');
  }

  mineBlock(difficulty) {
    let target = Array(difficulty + 1).join('0');
    while(this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

const genesisBlock = new Block(0, new Date().toISOString(), 100, "0");
genesisBlock.mineBlock(2);
console.log("NXT ⥉ JS blockchain.js: Block 0 mined:", genesisBlock.hash);

const block1 = new Block(1, new Date().toISOString(), 300, genesisBlock.hash);
block1.mineBlock(2);
console.log("NXT ⥉ JS blockchain.js: Block 1 mined:", block1.hash);
