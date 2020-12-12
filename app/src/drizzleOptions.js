import Dex from "./contracts/Dex.json";
import Token from "./contracts/Token.json";

/*const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:8545")
  },
  contracts: [Dex, Token],
  events: {
    SimpleStorage: ["StorageSet"],
  },
};*/

const options = {
  web3: {
    block: false,
    fallback: {
    	type: "ws",
    	url: "ws://127.0.0.1:8545"
    }
  },
  contracts: [Dex, Token],
  events: {},
};

export default options;