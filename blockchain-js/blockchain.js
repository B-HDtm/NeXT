const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

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
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.difficulty = 2;
    this.loadChain();
  }

  loadChain() {
    const filePath = path.join(__dirname, 'block', 'blockchain.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      this.chain = JSON.parse(data);
    } else {
      const genesisBlock = new Block(0, new Date().toISOString(), 100, "0");
      genesisBlock.mineBlock(this.difficulty);
      this.chain.push(genesisBlock);
      this.saveChain();
    }
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(amount) {
    const prevBlock = this.getLatestBlock();
    const newBlock = new Block(
      this.chain.length,
      new Date().toISOString(),
      amount,
      prevBlock.hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.saveChain();
    console.log(`NXT ⥉ New block mined: ${newBlock.hash} | Amount: ${amount}`);
  }

  saveChain() {
    const dir = path.join(__dirname, 'block');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(
      path.join(dir, 'blockchain.json'),
      JSON.stringify(this.chain, null, 2),
      'utf-8'
    );
  }
}

function runProgram(command) {
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    return output;
  } catch (e) {
    console.error(`Error running ${command}:`, e.message);
    return null;
  }
}

async function main() {
  const blockchain = new Blockchain();

  const programs = [
    './server-cpp/Hasher',
    './server-cpp/Hasher2',
    'php api-php/send.php',
    'php api-php/notify.php',
    'java -cp logger-java Logger',
    'java -cp logger-java Notifier'
  ];

  for (const cmd of programs) {
    const output = runProgram(cmd);
    if (!output) continue;

    const amountMatch = output.match(/Amount:\s*(\d+)/);
    if (amountMatch) {
      const amount = parseInt(amountMatch[1], 10);
      blockchain.addBlock(amount);
    } else {
      blockchain.addBlock(0);
    }
  }

  console.log('✅ Blockchain updated and saved to block/blockchain.json');
}

main();

