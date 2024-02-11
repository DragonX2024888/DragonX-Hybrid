import { ethers, ignition } from 'hardhat'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'

import { SwapHelper } from '../typechain-types/contracts/mocks'
import { IDragonX, DragonHybrid, ITitanX, DragonBurnProxy, BurnDragonHybridProxy } from '../typechain-types'
import IgniteDragonHybrid from '../ignition/modules/DragonHybrid'
import IgnitionParameters from '../ignition/parameters.json'

import * as Constants from './Constants'

export interface Fixture {
  dragonX: IDragonX;
  titanX: ITitanX;
  dragonHybrid: DragonHybrid;
  dragonBurnProxy: DragonBurnProxy;
  burnDragonHybridProxy: BurnDragonHybridProxy;
  swap: SwapHelper;
  genesis: HardhatEthersSigner;
  user: HardhatEthersSigner;
  others: HardhatEthersSigner[];
}

export interface DragonDetails {
  lockupAmount: bigint;
  mintFee: bigint;
  burnFee: bigint;
}

export async function deployDragonHybridFixture(): Promise<Fixture> {
  // Contracts are deployed using the first signer/account by default
  const [genesis, user, ...others] = await ethers.getSigners()

  // Factories
  const fSwap = await ethers.getContractFactory('SwapHelper')
  const fBurnDragonHybridProxy = await ethers.getContractFactory('BurnDragonHybridProxy')

  // Deployed contracts
  const dragonX = await ethers.getContractAt('IDragonX', Constants.DRAGONX_ADDRESS)
  const titanX = await ethers.getContractAt('ITitanX', Constants.TITANX_ADDRESS)

  // Deploy Others
  const swap = await fSwap.deploy()
  const burnDragonHybridProxy = await fBurnDragonHybridProxy.deploy()

  // Market buy TitanX
  await swap.connect(genesis).swapETHForTitanX({ value: ethers.parseEther('10') })
  await swap.connect(user).swapETHForTitanX({ value: ethers.parseEther('500') })

  // Use half of the balance to mint DragonX
  let mintAmount = (await titanX.balanceOf(genesis.address) * 100n) / 200n
  await titanX.connect(genesis).approve(await dragonX.getAddress(), mintAmount)
  await dragonX.connect(genesis).mint(mintAmount)

  mintAmount = (await titanX.balanceOf(user.address) * 100n) / 200n
  await titanX.connect(user).approve(await dragonX.getAddress(), mintAmount)
  await dragonX.connect(user).mint(mintAmount)

  // Deploy DragonX-Hybrid with ignition
  const deployment = await ignition.deploy(IgniteDragonHybrid, {
    parameters: IgnitionParameters,
  })
  const dragonHybrid: DragonHybrid = deployment.dragonHybrid as unknown as DragonHybrid
  const dragonBurnProxy: DragonBurnProxy = deployment.dragonBurnProxy as unknown as DragonBurnProxy

  return { dragonX, titanX, dragonHybrid, dragonBurnProxy, swap, genesis, user, others, burnDragonHybridProxy }
}

export function getDragonDetails(dragonType: Constants.DragonTypes): DragonDetails {
  switch (dragonType) {
    case Constants.DragonTypes.Apprentice:
      return {
        lockupAmount: Constants.APPRENTICE_LOCKUP_AMOUNT,
        mintFee: Constants.APPRENTICE_MINT_FEE,
        burnFee: Constants.APPRENTICE_BURN_FEE,
      }

    case Constants.DragonTypes.Ninja:
      return {
        lockupAmount: Constants.NINJA_LOCKUP_AMOUNT,
        mintFee: Constants.NINJA_MINT_FEE,
        burnFee: Constants.NINJA_BURN_FEE,
      }

    case Constants.DragonTypes.Samurai:
      return {
        lockupAmount: Constants.SAMURAI_LOCKUP_AMOUNT,
        mintFee: Constants.SAMURAI_MINT_FEE,
        burnFee: Constants.SAMURAI_BURN_FEE,
      }

    case Constants.DragonTypes.Shogun:
      return {
        lockupAmount: Constants.SHOGUN_LOCKUP_AMOUNT,
        mintFee: Constants.SHOGUN_MINT_FEE,
        burnFee: Constants.SHOGUN_BURN_FEE,
      }

    case Constants.DragonTypes.Emperor:
      return {
        lockupAmount: Constants.EMPEROR_LOCKUP_AMOUNT,
        mintFee: Constants.EMPEROR_MINT_FEE,
        burnFee: Constants.EMPEROR_BURN_FEE,
      }

    default:
      throw new Error('Unknown Dragon Type')
  }
}

export async function prepareMintNft(fixture: Fixture, dragonType: Constants.DragonTypes) {
  const { titanX, dragonX, dragonHybrid, user } = fixture
  const dragonHybridAddress = await dragonHybrid.getAddress()
  const details = getDragonDetails(dragonType)

  await titanX.connect(user).approve(dragonHybridAddress, details.mintFee)
  await dragonX.connect(user).approve(dragonHybridAddress, details.lockupAmount)
}

export async function prepareMintNftGenesis(fixture: Fixture, dragonType: Constants.DragonTypes) {
  const { titanX, dragonX, dragonHybrid, genesis } = fixture
  const dragonHybridAddress = await dragonHybrid.getAddress()
  const details = getDragonDetails(dragonType)

  await titanX.connect(genesis).approve(dragonHybridAddress, details.mintFee)
  await dragonX.connect(genesis).approve(dragonHybridAddress, details.lockupAmount)
}

export async function prepareBurnNft(fixture: Fixture, id: bigint) {
  const { dragonX, dragonHybrid, user } = fixture
  const dragonType = await dragonHybrid.tokenIdToDragonType(id)
  const dragonHybridAddress = await dragonHybrid.getAddress()

  const details = getDragonDetails(Constants.toDragonTypeEnum(dragonType))

  await dragonX.connect(user).approve(dragonHybridAddress, details.burnFee)
}
