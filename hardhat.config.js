require("@nomiclabs/hardhat-waffle");

/*
To keep some config info private:
create a file called 'dappconfig.js' in your project root.
add it to your .gitignore so it remains only on your local dev env.
add the below to 'dappconfig.js':
const endpoint = "your endpoint address";
const private_key = 'your private key';
const deployedAddress = "you contract address once the contract is deployed";
module.exports = { endpoint, private_key, deployedAddress };
*/
const { private_key, endpoint } = require("./src/dappconfig");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    ropsten: {
      url: endpoint,
      accounts: [`0x${private_key}`]
    },
    
  }
};

