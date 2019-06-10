const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Atribuindo uma chave Publica e privada a variavel 'key'
const key = ec.genKeyPair();

// Convertendo as keys em hexadecimais
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log();
console.log('Private Key: ' + privateKey);

console.log();
console.log('Public Key: ' + publicKey);
