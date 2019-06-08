let crypto = require('crypto-js/sha256');


// Criando Bloco
class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calcHash();
        this.nonce = 0;
    }

    // Metodo para calcular Hash
    calcHash(){
        return crypto(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // Metodo para implementação da dificuldade no Hash
    minBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calcHash();
        }

        console.log("Block mind: " + this.hash);
    }
}


// Criando Blockchain
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    //Criando o Bloco Genesis (Primeiro bloco de um Blockchain)
    createGenesisBlock(){
        return new Block(0, "01/01/2019", "Genesis block", "0");
    }
    
    //Metodo para buscar o Hash do bloco anterior
    getLastBlock(){
        return this.chain[this.chain.length -1]; 
    }
    
    //Metodo para adicionar um novo bloco a cadeia de blocos (Blockchain)
    addBlock(newBlock){
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.minBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    //Metodo para validar os blocos do Blockchain
    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

             if(currentBlock.hash !== currentBlock.calcHash()){
                 return 'Blockchain inválido !';
             }
             if(currentBlock.previousHash !== previousBlock.hash){
                 return 'Blockchain inválido !\n';
             }  
        }
        return 'Blockchain Válido\n';
    }
}

//Instaciando um novo Blockchain
let save = new Blockchain();

//Adionando bloco no Blockchain
console.log('Mining block 1...');
save.addBlock(new Block(1, "01/01/2019", "Dados do primeiro bloco"));

console.log('Mining block 2...');
save.addBlock(new Block(2, "10/01/2019", "Dados do segundo bloco"));

//Resultado do validador dos blocos
console.log("O blockchain é valido? \n" + save.isChainValid());
console.log(JSON.stringify(save, null, 5));