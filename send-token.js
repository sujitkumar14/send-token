var ethers = require('ethers');
var bluebird = require('bluebird');
var abi = require('./abi');


/**
 * function to transfer tokens to cold wallet
 * @param privateKey - the privatekey that holding the tokens
 * @param to - to address
 * @param balance - total number of token you want to send or transfer
 * @param contractAddress - contract address of tokens
 * @network - testnet or mainnet
 * @return {*} - promise object - result of transaction result of transfer 
 */


module.exports = function(privateKey,to,balance,contractAddress,network){

    return new bluebird.Promise(function(resolve,reject) {

if(privateKey.substr(0,2) !== '0x'){
            privateKey = '0x'+privateKey; 
        }
           
    			var wallet = new ethers.Wallet(privateKey);
                var providers = ethers.providers;
                var utils = ethers.utils;
                var provider;

                 if(network === 'testnet'){
            provider = new providers.InfuraProvider(providers.networks.ropsten);
            wallet.provider = ethers.providers.getDefaultProvider('ropsten');
        }

        else{
            provider = new providers.InfuraProvider(providers.networks.mainnet);
            wallet.provider = ethers.providers.getDefaultProvider();
        }

               
                
                var contract = new ethers.Contract(contractAddress, abi, wallet);
               
                contract.decimals()
                .then(function(decimals){
                
                	 var numberOfTokens = utils.parseUnits(balance,decimals[0]);
                	
                	 return  contract.transfer(to, numberOfTokens);
                })
                .then(function(tx){
                	
                	 resolve(tx);
                })
                .catch(function (err) {

                       var responseText = JSON.parse(err.responseText);
                var error = responseText["error"];
                var message = error["message"];
                reject(message);
                });
             
                    
            
        });
    

};