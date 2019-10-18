import React from 'react';
import Checker from './Checker';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ERC20 Verifier</h1>
        <p>
          Enter the address of an ERC20 contract to check if it conforms to the standard
        </p>
      </header>
      <div className="App-body">
        <Checker />
        <p className="App-notes">The contract source code must be verified on etherscan, and be compiled with Solidity v0.5. This page uses <a href="https://github.com/tinchoabbate/slither-scripts/tree/master/erc20">tinchoabbate's slither-scripts</a> to check whether a contract is a valid ERC20 or not. The script does not verify that the functions found behave as expected. It just checks for matching signatures, return types, existence of custom modifiers, event emissions, among others.</p>
      </div>
    </div>
  );
}

export default App;
