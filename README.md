# ERC20 verifier

Fork of [tinchoabbate's slither-scripts](https://github.com/tinchoabbate/slither-scripts/tree/master/erc20) packed as an AWS lambda using Chalice, with a create-react-app frontend. Accepts an address, fetches the source code from Etherscan, and runs Slither to verify ERC20 compatibility using solc 0.5.12.

https://erc20-verifier.openzeppelin.com/

> Bear in mind that, currently, the script does not verify that the functions found behave as expected. It just checks for matching signatures, return types, existence of custom modifiers, event emissions, among others. You still have to manually (or dynamically) test the functions to make sure they are doing the right thing.

Use at your own risk!
