import React from 'react';
import Checker from './Checker';
import './App.css';
import './fonts/silka-semibold-webfont.ttf'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ERC20 Verifier</h1>
        <h2>
          Enter the address of an ERC20 contract to check if it conforms to the standard
        </h2>
      </header>
      <div className="App-body">
        <Checker />
        <p className="App-notes">The contract source code must be verified on etherscan, and be compiled with Solidity v0.4 or v0.5. This page uses <a href="https://github.com/tinchoabbate/slither-scripts/tree/master/erc20" target="_blank">tinchoabbate's slither-scripts</a> to check whether a contract is a valid ERC20 or not using Slither. The script does not verify that the functions found behave as expected. It just checks for matching signatures, return types, existence of custom modifiers, event emissions, among others. These scripts may have bugs, use them at your own risk.</p>
        <p className="App-notes">Have any feedback? Share any thoughts in the <a href="https://forum.openzeppelin.com/t/online-erc20-contract-verifier/1575" target="_blank" rel="noopener noreferrer" target="_blank">OpenZeppelin forum.</a></p>
      </div>
    </div>
  );
}

export default App;
