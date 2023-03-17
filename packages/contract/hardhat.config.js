require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const { YOUR_ALCHEMY_API_URL, YOUR_PRIVATE_ACCOUNT_KEY } = process.env;

module.exports = {
  solidity: '0.8.18',
  networks: {
    sepolia: {
      url: YOUR_ALCHEMY_API_URL,
      accounts: [YOUR_PRIVATE_ACCOUNT_KEY],
    },
  },
};
