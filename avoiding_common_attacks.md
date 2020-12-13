# Avoiding Common Attacks

### Reentrancy:

Attention was made to mitigate this by first doing internal work inside the functions before calling external contracts

## Integer Overflow and Underflow

This project uses `SafeMath` from **OpenZeppelin library** which has math operations with safety checks that throw on error.

## Logic Bugs

Simple programming mistakes can cause the contract to behave differently to its stated rules, especially on 'edge cases'.

In this project this attack is mitigated by:

- Thorough test coverage of most contract use cases
- Following documented best practices with Solidity programming
- Extensive checks using require() in all state-affecting functions