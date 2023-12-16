const TronWeb = require('tronweb');
const readline = require('readline')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "Your Private Keys"; //
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

const blackHole = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";  //black hole address

const memo = 'data:,{"p":"trc-20","op":"mint","tick":"trxi","amt":"1000"}';  

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  function promptUser() {
    return new Promise((resolve) => {
      rl.question('Enter the number of transactions to mint: ', (answer) => {
        resolve(parseInt(answer));
      });
    });
  }
  
  async function main() { 	
    console.log(`
  +-----------------------------------------+
              TRX MINT INSCRIPTION
                Edit By : arapzz
  +-----------------------------------------+
      `)
    const numTransactions = await promptUser();
    console.log(`Minting ${numTransactions} transactions...`);
      
    for (let i = 0; i < numTransactions; i++) {
      console.log(`Processing transaction ${i + 1}...`);
  
      const unSignedTxn = await tronWeb.transactionBuilder.sendTrx(blackHole, 1); // 0.000001 TRX is the minimum transfer amount.
      const unSignedTxnWithNote = await tronWeb.transactionBuilder.addUpdateData(unSignedTxn, memo, 'utf8');
      const signedTxn = await tronWeb.trx.sign(unSignedTxnWithNote);
  
      // Introduce a delay of 3 seconds between transactions
      await new Promise(resolve => setTimeout(resolve, 3000));
  
      const ret = await tronWeb.trx.sendRawTransaction(signedTxn);
      const txHash = ret.transaction.txID;
  
      console.log(`Transaction ${i + 1} completed. Hash: ${txHash}`);
    }
  
    console.log("All transactions completed successfully");
    rl.close();
  }
  
  main()
    .catch((err) => {
      console.error("Error:", err);
    });
