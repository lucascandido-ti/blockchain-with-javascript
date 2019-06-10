let crypto = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

//Criando classe de Transação
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    // Geramos um Hash para transação
    calcHash(){
        return crypto(this.fromAddress + this.toAddress + this.amount).toString();
    }

    // Metodo para assinar uma transferencia
    signTransaction(signingKey){

        // Se a assinatura publica for diferente da pessoa que deseja a transação, o erro é lançado
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('Você não pode assinar um transação por outra carteira!');
            
        }
        const hashTx = this. calcHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    // Validando assinatura
    isValid(){
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('Não a assinatura nesta transação');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calcHash(), this.signature);
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

    // Testa cada transação de uma cadeia
    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false
            }
        }
        return true;
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
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);
        // Instancio um novo bloco passando o horario atual e as informações da transação
        let block = new Block(Date.now(), this.pendingTransactions);

        // Faço a crianção do Hash para este bloco
        block.minBlock(this.difficulty);

        // Adiciono o novo bloco na cadeia (Blockchain)
        console.log('Block successfully mind !');
        this.chain.push(block);

        // Passa o objeto da transação para o Blockchain
        this.pendingTransactions = [];
    }

    // Metodo para criar nova transação
    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('A Trasação precisa incluir de quem e para quem...')
        }

        if(!transaction.isValid()){
            throw new Error('A transação não pode ser adionada ao Blockchain');
        }

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

             if(!currentBlock.hasValidTransactions()){
                 return 'Blockchain inválido !';
             }

             if(currentBlock.hash !== currentBlock.calcHash()){
                 return 'Blockchain inválido !';
             }
        }
        return 'Blockchain Válido\n';
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;