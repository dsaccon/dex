// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.21 <0.7.0;

import "./SafeMath.sol";
import { IERC20 } from "./Token.sol";

/// @title Simple decentralized exchange (dex), with pricing system similar to Uniswap
/// @author David S
/// @notice For demo purposes only. Do not deploy on mainnet
/// @dev All function calls are currently implemented without side effects
contract Dex {

	using SafeMath for uint256;
	IERC20 token;

	uint256 public totalLiquidity;
	mapping (address => uint256) public liquidity;

	constructor(address token_addr)
		public
	{
		token = IERC20(token_addr);
		totalLiquidity = 0;
	}

	function init(uint256 tokens)
		public payable returns (uint256)
	{
		require(totalLiquidity == 0, "DEX:init - already has liquidity");
		require(msg.value == tokens*10**18, "DEX:init - must use equal amount of Eth and token");
		totalLiquidity = address(this).balance;
		liquidity[msg.sender] = totalLiquidity;
		require(token.transferFrom(msg.sender, address(this), tokens));
		return totalLiquidity;
 	}

	function price(uint256 input_amount, uint256 input_reserve, uint256 output_reserve)
		public pure returns (uint256)
	{
		uint256 input_amount_with_fee = input_amount.mul(997);
		uint256 numerator = input_amount_with_fee.mul(output_reserve);
		uint256 denominator = input_reserve.mul(1000).add(input_amount_with_fee);
		return numerator / denominator;
	}

	function getEthLiquidity()
		public view returns (uint256)
	{
		uint256 _ethLiquidity = address(this).balance;
		return _ethLiquidity;
	}

	function getTokenLiquidity()
		public view returns (uint256)
	{
		uint256 _tknLiquidity = token.balanceOf(address(this));
		return _tknLiquidity;
	}

	/// @notice input_ETH in wei
	function getPriceEthToToken(uint256 input_ETH)
		public view returns (uint256)
	{
		return price(input_ETH, address(this).balance, token.balanceOf(address(this)));
	}

	/// @notice Send ETH amount (in wei) in transaction to this function
	function ethToToken()
		public payable returns (uint256)
	{
  		uint256 token_reserve = token.balanceOf(address(this));
  		uint256 tokens_bought = price(msg.value, address(this).balance.sub(msg.value), token_reserve);
  		require(token.transfer(msg.sender, tokens_bought));
  		totalLiquidity = address(this).balance;
  		return tokens_bought;
	}

	function getPriceTokenToEth(uint256 input_Token)
		public view returns (uint256)
	{
		return price(input_Token, token.balanceOf(address(this)), address(this).balance);
	}

	function tokenToEth(uint256 tokens)
		public returns (uint256)
	{
  		uint256 token_reserve = token.balanceOf(address(this));
  		uint256 eth_bought = price(tokens, token_reserve, address(this).balance);
  		msg.sender.transfer(eth_bought);
  		require(token.transferFrom(msg.sender, address(this), tokens));
  		return eth_bought;
	}

	/// @notice Send ETH in a transaction, func with transfer Token from sender according to pool balance
	function deposit()
		public payable returns (uint256)
	{
		uint256 eth_reserve = address(this).balance.sub(msg.value);
		uint256 token_reserve = token.balanceOf(address(this));
		uint256 token_amount = (msg.value.mul(token_reserve) / eth_reserve).add(1);
		uint256 liquidity_minted = msg.value.mul(totalLiquidity) / eth_reserve;
		liquidity[msg.sender] = liquidity[msg.sender].add(liquidity_minted);
		totalLiquidity = totalLiquidity.add(liquidity_minted);
		require(token.transferFrom(msg.sender, address(this), token_amount));
		return liquidity_minted;
	}

	/// @notice Withdraws 'amount' of ETH and Token (according to pool balance) to sender's account
	/// @dev 'amount' in wei
	function withdraw(uint256 amount)
		public returns (uint256, uint256)
	{
		uint256 _amount = amount*10**18;
		uint256 token_reserve = token.balanceOf(address(this));
		uint256 eth_amount = _amount.mul(address(this).balance) / totalLiquidity;
		uint256 token_amount = _amount.mul(token_reserve) / totalLiquidity;
		require(address(this).balance > eth_amount, "Withdrawal amount exceeds available dex ETH liquidity");
		require(token.balanceOf(address(this)) > token_amount, "Withdrawal amount exceeds available dex Token liquidity");
		require(liquidity[msg.sender] > eth_amount, "Withdrawal amount exceeds account ETH balance");
		liquidity[msg.sender] = liquidity[msg.sender].sub(eth_amount);
		totalLiquidity = totalLiquidity.sub(eth_amount);
		msg.sender.transfer(eth_amount);
		require(token.transfer(msg.sender, token_amount));
		return (eth_amount, token_amount);
	}

	function() external payable {}
}