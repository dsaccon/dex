const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "d16c40e6830949fd9bbc5eb498fca4de";

const fs = require('fs');
const mnemonic = 'draft broccoli cute stairs aisle garden under palm calm minimum name plunge'

// https://rinkeby.infura.io/v3/d16c40e6830949fd9bbc5eb498fca4de

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: { // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/' + infuraKey),
      network_id: 4,
      gas: 5500000,
    },
  },
};
