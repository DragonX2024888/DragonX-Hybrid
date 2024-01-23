import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-contract-sizer'
import '@nomicfoundation/hardhat-ignition-ethers'
import '@nomiclabs/hardhat-solhint'

// Gas Report
let gasReportEnabled = false
let coinmarketcapApiKey = ''
if (process.env.COINMARKETCAP_API_KEY) {
  gasReportEnabled = true
  coinmarketcapApiKey = process.env.COINMARKETCAP_API_KEY
}

// Fund accounts in hardhat network with 10 eth
const eth = 1000
const wei = BigInt(eth) * BigInt(10 ** 18)
const accountBalance = wei.toString()

// RPC endpoint
let forking
if (process.env.RPC_ETH) {
  console.log(`Fork local hardhat network from ${process.env.RPC_ETH}`)
  forking = {
    url: process.env.RPC_ETH,

    // DragonX deployed, still in 1:1 mint phase
    blockNumber: 19097970,
  }
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.20', // limit compiler version for other chains than ethereum mainnet
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
          metadata: {
            // do not include the metadata hash, since this is machine dependent
            // and we want all generated code to be deterministic
            bytecodeHash: 'none',
          },
        },
      },
      {
        version: '0.7.6',
        settings: {},
      },
    ],
  },
  networks: {
    localnode: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
    },
    frame_local: {
      url: 'http://127.0.0.1:1248',
      chainId: 31337,
    },
    frame_mainnet: {
      url: 'http://127.0.0.1:1248',
      chainId: 1,
    },
    hardhat: {
      allowBlocksWithSameTimestamp: true,
      forking,
      accounts: {
        mnemonic: process.env.HARDHAT_MNEMONIC || '',
        accountsBalance: accountBalance,
        count: 10,
      },
      chainId: 31337,
    },
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 21,
    coinmarketcap: coinmarketcapApiKey,
    enabled: gasReportEnabled,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 72000000,
  },
}

export default config
