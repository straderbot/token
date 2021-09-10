import { HardhatUserConfig } from 'hardhat/config'

// Plugins

import '@nomiclabs/hardhat-solhint'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

import 'hardhat-gas-reporter'
import '@typechain/hardhat'

// Credentials


// Config

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: './artifacts',
    sources: './contracts',
    tests: './tests',
  },
  networks: {
    // ropsten: {
    //   url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    //   accounts: [`0x${PRIVATE_KEY.ropsten}`],
    // },
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        // blockNumber: 12658249,
        blockNumber: 12769470,
      },
    },
  },
  typechain: {
    outDir: './types',
    alwaysGenerateOverloads: true,
  },
  gasReporter: {
    currency: 'USD',
    outputFile: 'gas-report.log',
  },
}

export default config
