require('@nomiclabs/hardhat-etherscan');
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const { ETHERSCAN_API_KEY, STAGING_ALCHEMY_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: '0.8.18',
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  defaultNetwork: 'hardhat',
  networks: {
    sepolia: {
      url: STAGING_ALCHEMY_KEY || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};
