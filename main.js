const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const myKey = ec.keyFromPrivate('92e6b37c72231f3b4f270a8f2e1db5c17f2a038f443ff15f438ad7ae4ef8448c');
const myWalletAddress = myKey.getPublic('hex');

//Instaciando um novo Blockchain
let save = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
save.addTransaction(tx1);

console.log('\n Starting the miner...');
save.minePendingTransactions(myWalletAddress);

console.log(`\nBalance of Xavier is `, save.getBalanceOfAddress(myWalletAddress));

// Testando validação da cadeia modificando valor de uma tranferencia
// save.chain[1].transactions[0].amount = 1;

console.log('Is chain is Valid? ', save.isChainValid());

