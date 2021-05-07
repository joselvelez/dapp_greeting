import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';

// import the compiled contract
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

// get the contract address from the dappconfig file & store it
const { deployedAddress } = require('./dappconfig');
const contractAddress = deployedAddress;

function App() {
  // store the greeting in local state
  const [greeting, setGreetingValue] = useState('');

  // request access to the user's metamask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts'});
  }
  /*
  'eth_requestAccounts' is an Ethereum JSON-RPC method
  See more info here: https://docs.metamask.io/guide/rpc-api.html#eth-requestaccounts
  */

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    // check if a wallet is installed - like metamask
    if (typeof window.ethereum !== 'undefined') {
      // if a wallet is defined, set an instance of provider to that wallet
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // set an instance of the contract to interact with
      const contract = new ethers.Contract(contractAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        const el = document.getElementById('greetingSpan');
        el.innerText = data;
        el.classList.replace('greetingHidden', 'greetingDisplayed');
        
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) {
      alert('You must type a greeting!');
      return;
    }
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      // reset state for greetingvalue once transaction has been sent
      setGreetingValue('');
      await transaction.wait();
      fetchGreeting();
      
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="main">
          <div className="fetchGreeting">
            <button onClick={fetchGreeting}>Fetch Greeting</button>
            <span className="greetingHidden" id="greetingSpan"></span>
          </div>
          <div className="setGreeting">
            <button onClick={setGreeting}>Set Greeting</button>
            <input
              onChange={e => setGreetingValue(e.target.value)}
              placeholder="Set a greeting"
              value={greeting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
