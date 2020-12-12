pragma solidity >=0.4.21 <0.7.0;

import "./SafeMath.sol";
import { IERC20 } from "./Token.sol";

contract Dex {

	using SafeMath for uint256;
	IERC20 token;

	uint256 public totalLiquidity;
	mapping (address => uint256) public liquidity;

	// Test functions
	string greeting = "Hello World";

	function set(string memory _greeting) public {
		greeting = _greeting;
	}

	function get() public view returns (string memory) {
		return greeting;
	}

	function getLiquidity() public view returns (uint256) {
		return totalLiquidity;
	}

	function refreshLiquidity() public {
		totalLiquidity = address(this).balance;
	}

	function getEthBalance() public view returns (uint256) {
		return address(this).balance;
	}

	// End of test functions

	// Core DEX functions

	constructor(address token_addr) public {
		token = IERC20(token_addr);
		totalLiquidity = 0;
	}

	function init(uint256 tokens) public payable returns (uint256) {
		require(totalLiquidity == 0, "DEX:init - already has liquidity");
		require(msg.value == tokens*10**18, "DEX:init - must use equal amount of Eth and token");
		totalLiquidity = address(this).balance;
		liquidity[msg.sender] = totalLiquidity;
		require(token.transferFrom(msg.sender, address(this), tokens));
		return totalLiquidity;
 	}

 	function price(uint256 input_amount, uint256 input_reserve, uint256 output_reserve) public pure returns (uint256) {
  		uint256 input_amount_with_fee = input_amount.mul(997);
  		uint256 numerator = input_amount_with_fee.mul(output_reserve);
  		uint256 denominator = input_reserve.mul(1000).add(input_amount_with_fee);
  		return numerator / denominator;
	}

	function getPriceEthToToken(uint256 input_ETH) public view returns (uint256) {
		return price(input_ETH, address(this).balance, token.balanceOf(address(this)));
	}

	function ethToToken() public payable returns (uint256) {
  		uint256 token_reserve = token.balanceOf(address(this));
  		uint256 tokens_bought = price(msg.value, address(this).balance.sub(msg.value), token_reserve);
  		require(token.transfer(msg.sender, tokens_bought));
  		totalLiquidity = address(this).balance;
  		return tokens_bought;
	}

	function getPriceTokenToEth(uint256 input_Token) public view returns (uint256) {
		return price(input_Token, token.balanceOf(address(this)), address(this).balance);
	}

	function tokenToEth(uint256 tokens) public returns (uint256) {
  		uint256 token_reserve = token.balanceOf(address(this));
  		uint256 eth_bought = price(tokens, token_reserve, address(this).balance);
  		msg.sender.transfer(eth_bought);
  		require(token.transferFrom(msg.sender, address(this), tokens));
  		return eth_bought;
	}

	function deposit() public payable returns (uint256) {
	  // Send an amount of ETH in a transaction
	  // Function will initiate Token transfer from sender
	  // Token amount calculated, based off balance of liquidity in pool
	  uint256 eth_reserve = address(this).balance.sub(msg.value);
	  uint256 token_reserve = token.balanceOf(address(this));
	  uint256 token_amount = (msg.value.mul(token_reserve) / eth_reserve).add(1);
	  uint256 liquidity_minted = msg.value.mul(totalLiquidity) / eth_reserve;
	  liquidity[msg.sender] = liquidity[msg.sender].add(liquidity_minted);
	  totalLiquidity = totalLiquidity.add(liquidity_minted);
	  require(token.transferFrom(msg.sender, address(this), token_amount));
	  return liquidity_minted;
	}

	function withdraw(uint256 amount) public returns (uint256, uint256) {
	  // Withdraws 'amount' number of ETH to sender's account
	  // Initiate Token transfer to sender
	  // Token amount calculated, based off balance of liquidity in pool
	  uint256 token_reserve = token.balanceOf(address(this));
	  uint256 eth_amount = amount.mul(address(this).balance) / totalLiquidity;
	  uint256 token_amount = amount.mul(token_reserve) / totalLiquidity;
	  liquidity[msg.sender] = liquidity[msg.sender].sub(eth_amount);
	  totalLiquidity = totalLiquidity.sub(eth_amount);
	  msg.sender.transfer(eth_amount);
	  require(token.transfer(msg.sender, token_amount));
	  return (eth_amount, token_amount);
	}

 	function() external payable { }
}