let catchRevert = require("./exceptionsHelpers.js").catchRevert
var Dex = artifacts.require("Dex");
var Token = artifacts.require("Token");

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

contract("Dex", accounts => {

  beforeEach(async () => {
    await Token.deployed();
    tokenInstance = await Token.new("token", "TKN", 18, 1000000, {from: accounts[0]});
    dexInstance = await Dex.new(tokenInstance.address);
//    await dexInstance.init.call(50, {value: 50*10**18})
  });

//  const dexInstance = await Dex.deployed()

//  var tokenInstance = await Token.new("token", "TKN", 18, 1000000)
//  var dexInstance = await Dex.new(tokenInstance.address)

  it("should return 0", async () => {

//    const tokenInstance = await Token.deployed()
//    dexInstance = await Dex.new(Token.address)
    const ethLiqBal = await dexInstance.getEthLiquidity.call();
    const tokenLiqBal = await dexInstance.getTokenLiquidity.call();
    assert.equal(ethLiqBal, 0, "The value was not 0");
    assert.equal(tokenLiqBal, 0, "The value was not 0");
  });

  it("should return 15", async () => {

    await dexInstance.init(15, {value: 15*10**18, from: accounts[0]})
    const ethLiqBal = await dexInstance.getEthLiquidity.call();
    const tokenLiqBal = await dexInstance.getTokenLiquidity.call();
    assert.isAtLeast(parseFloat(ethLiqBal), 14.9*10**18, "The value was not near 15");
    assert.isAtMost(parseFloat(ethLiqBal), 15.1*10**18, "The value was not 15");
    assert.equal(tokenLiqBal, 15, "The value was not 15");
  });

  it("Account ETH bal should decrease, account Token bal should increase, after transaction", async () => {

      await dexInstance.init(5, {value: 5*10**18, from: accounts[0]})
      let acctTokenBalBefore = await tokenInstance.balanceOf.call(accounts[0]);
      let acctEthBalBefore = await web3.eth.getBalance(accounts[0]);
      let result = await dexInstance.ethToToken({value: 3*10**18, from: accounts[0]});
      let acctTokenBalAfter = await tokenInstance.balanceOf.call(accounts[0]);
      let acctEthBalAfter = await web3.eth.getBalance(accounts[0]);

      assert.isBelow(parseFloat(acctTokenBalBefore), parseFloat(acctTokenBalAfter), "Account token bal before is not less than after transaction");
      assert.isBelow(parseFloat(acctEthBalAfter), parseFloat(acctEthBalBefore), "Account ETH bal after is not less than before transaction ");
  });

  it("Account ETH bal should increase, account Token bal should decrease, after transaction", async () => {

      await dexInstance.init(5, {value: 5*10**18, from: accounts[0]})
      let acctTokenBalBefore = await tokenInstance.balanceOf.call(accounts[0]);
      let acctEthBalBefore = await web3.eth.getBalance(accounts[0]);
      let result = await dexInstance.tokenToEth(3);
      let acctTokenBalAfter = await tokenInstance.balanceOf.call(accounts[0]);
      let acctEthBalAfter = await web3.eth.getBalance(accounts[0]);

      assert.isBelow(parseFloat(acctTokenBalAfter), parseFloat(acctTokenBalBefore), "Account token bal after is not less than before transaction");
      assert.isBelow(parseFloat(acctEthBalBefore), parseFloat(acctEthBalAfter), "Account ETH bal before is not less than after transaction ");
  });

  it("Dex Eth and Token bals should increase and Account Eth and Token bals should decrease after invest liquidity from account", async () => {

      await dexInstance.init(5, {value: 5*10**18, from: accounts[0]})
      let acctTokenBalBefore = await tokenInstance.balanceOf.call(accounts[0]);
      let acctEthBalBefore = await web3.eth.getBalance(accounts[0]);
      let dexTokenBalBefore = await dexInstance.getTokenLiquidity.call();
      let dexEthBalBefore = await dexInstance.getEthLiquidity.call();
      let result = await dexInstance.deposit({value: 3*10**18, from: accounts[0]});
      let acctTokenBalAfter = await tokenInstance.balanceOf.call(accounts[0]);
      let acctEthBalAfter = await web3.eth.getBalance(accounts[0]);
      let dexTokenBalAfter = await dexInstance.getTokenLiquidity.call();
      let dexEthBalAfter = await dexInstance.getEthLiquidity.call();

      assert.isBelow(parseFloat(acctTokenBalAfter), parseFloat(acctTokenBalBefore), "Account token bal after is not less than before transaction");
      assert.isBelow(parseFloat(acctEthBalAfter), parseFloat(acctEthBalBefore), "Account ETH bal after is not less than before transaction ");
      assert.isBelow(parseFloat(dexTokenBalBefore), parseFloat(dexTokenBalAfter), "Dex token bal before is not less than after transaction");
      assert.isBelow(parseFloat(dexEthBalBefore), parseFloat(dexEthBalAfter), "Account ETH bal before is not less than after transaction ");
  });

  it("Dex Eth and Token bals should decrease and Account Eth and Token bals should increase after divest liquidity from account", async () => {

      await dexInstance.init(5, {value: 5*10**18, from: accounts[0]})
      let acctTokenBalBefore = await tokenInstance.balanceOf.call(accounts[0]);
      let acctEthBalBefore = await web3.eth.getBalance(accounts[0]);
      let dexTokenBalBefore = await dexInstance.getTokenLiquidity.call();
      let dexEthBalBefore = await dexInstance.getEthLiquidity.call();
      let result = await dexInstance.withdraw(3, {from: accounts[0]});
      let acctTokenBalAfter = await tokenInstance.balanceOf.call(accounts[0]);
      let acctEthBalAfter = await web3.eth.getBalance(accounts[0]);
      let dexTokenBalAfter = await dexInstance.getTokenLiquidity.call();
      let dexEthBalAfter = await dexInstance.getEthLiquidity.call();

      assert.isBelow(parseFloat(acctTokenBalBefore), parseFloat(acctTokenBalAfter), "Account token bal before is not less than after transaction");
      assert.isBelow(parseFloat(acctEthBalBefore), parseFloat(acctEthBalAfter), "Account ETH bal before is not less than after transaction ");
      assert.isBelow(parseFloat(dexTokenBalAfter), parseFloat(dexTokenBalBefore), "Dex token bal after is not less than before transaction");
      assert.isBelow(parseFloat(dexEthBalAfter), parseFloat(dexEthBalBefore), "Account ETH bal after is not less than before transaction ");
  });

});