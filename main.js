let crypto = require('crypto-js/sha256');

//Criando classe de Transação
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

}

// Criando Bloco
class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
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
        this.pendingTransactions =[];
        this.miningReward = 100;
    }

    //Criando o Bloco Genesis (Primeiro bloco de um Blockchain)
    createGenesisBlock(){
        return new Block(0, "01/01/2019", "Genesis block", "0");
    }
    
    //Metodo para buscar o Hash do bloco anterior
    getLastBlock(){
        return this.chain[this.chain.length -1]; 
    }
    
    // Metodo para adicionar um novo bloco a cadeia de blocos (Blockchain)
    addBlock(newBlock){
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.minBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    // Minerando a solicitação de transição
    minePendingTransactions(miningRewardAddress){
        // Instancio um novo bloco passando o horario atual e as informações da transação
        let block = new Block(Date.now(), this.pendingTransactions);

        // Faço a crianção do Hash para este bloco
        block.minBlock(this.difficulty);

        // Adiciono o novo bloco na cadeia (Blockchain)
        console.log('Block successfully mind !');
        this.chain.push(block);

        // Passa o objeto da transação para o Blockchain
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    // Metodo para criar nova transação
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    // Metodo para obter o saldo 
    getBalanceOfAddress(address){
        let balance = 0;

        // For para acessar cada bloco existente no blockchain
        for (const block of this.chain){

            // For para acessar cada transação de um bloco
            for(const trans of block.transactions){

                //Comparando os remetentes
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
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

save.createTransaction(new Transaction('address1', "address2", 100));
save.createTransaction(new Transaction('address2', "address1", 50));

console.log('\n Starting the miner...');
save.minePendingTransactions('xaviers-address');

console.log(`\nBalance of Xavier is `, save.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner again...');
save.minePendingTransactions('xaviers-address');

console.log(`\nBalance of Xavier is `, save.getBalanceOfAddress('xaviers-address'));