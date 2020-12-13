# Design Pattern Decisions

For simplicity, a few key features were not included:
* Token-to-Token swaps
* More intelligent ways to initialize the Dex's liquidity. Currently it requires the account providing ETH & Token liquidity on initialization deposit an equal number of each of these assets. According to the AMM pricing mechanism, this values each asset almost equal. An improved version would have a more intelligent way of determining the inital balance of liquidity between Eth & Token (perhaps using external information, e.g. pricing oracles)

Design Pattern choices:

Fail early and fail loud
1.  Extensive checking of function arguments against account balances (via require()) in all state-changing funcs
2.  All token transfers wrapped in require() to validate successfull transactions

Variables or functions are only public when required

Circuit breakers
Do not allow initialization of dex if liquidity balances are not zero, and if desired starting ETH & Token liquidity values are not the same