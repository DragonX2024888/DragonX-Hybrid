import * as fs from 'fs'

import { ethers, config as hardhatConfig } from 'hardhat'
import type {
  HardhatNetworkHDAccountsConfig,
} from 'hardhat/types'

import { deployDragonHybridFixture } from '../test/Fixture'

const outputFile = 'dev-environment-summary.txt'

function writeToSummary(data: string) {
  fs.appendFileSync(outputFile, data + '\n')
}

function getPrivateKey(index: number): string {
  const accounts = hardhatConfig.networks.hardhat.accounts as HardhatNetworkHDAccountsConfig
  const accountWallet = ethers.HDNodeWallet.fromPhrase(
    accounts.mnemonic,
    undefined,
    `m/44'/60'/0'/0/${index}`,
  )
  return accountWallet.privateKey
}

async function main() {
  // Empty file if it exists
  fs.writeFile(outputFile, '', (err) => {
    if (err) {
      console.error('Error emptying the file:', err)
    }
  })

  console.log('Start deploying local dev-environment.')

  const {
    dragonHybrid,
    dragonBurnProxy,
    genesis,
    user,
  } = await deployDragonHybridFixture()

  // Output formatting begins here:
  writeToSummary('===========================')
  writeToSummary('   DEPLOYMENT SUMMARY')
  writeToSummary('===========================')

  writeToSummary('\n💻 Node:')
  writeToSummary('---------------------------')
  writeToSummary('🌐 RPC: http://localhost:8545/')
  writeToSummary('🔗 Chain ID: 31337')

  writeToSummary('\n💼 Accounts:')
  writeToSummary('---------------------------')
  writeToSummary(`Genesis Deployer Address: ${genesis.address}\nPrivate Key: ${getPrivateKey(0)}`)
  writeToSummary(`\nUser Address: ${user.address}\nPrivate Key: ${getPrivateKey(1)}`)

  writeToSummary('\n🏭 Contracts:')
  writeToSummary('---------------------------')
  writeToSummary(`DragonX Hybrid Address: ${await dragonHybrid.getAddress()}`)
  writeToSummary(`DragonX Burn Proxy Address: ${await dragonBurnProxy.getAddress()}`)

  writeToSummary('\nShutdown with (Ctrl+C)')
  writeToSummary('\n===========================')
  writeToSummary('   END DEPLOYMENT SUMMARY')
  writeToSummary('===========================\n')

  console.log('Local dev-environment successfully deployed.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
