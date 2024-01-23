import {
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'

import { deployDragonHybridFixture, prepareMintNft, getDragonDetails, Fixture } from './Fixture'
import * as Constants from './Constants'

async function mintNft(fixture: Fixture, dragonType: Constants.DragonTypes) {
  const { dragonX, titanX, dragonHybrid, user } = fixture
  const details = getDragonDetails(dragonType)
  const userBalanceTitan = await titanX.balanceOf(user.address)
  const userBalanceDragon = await dragonX.balanceOf(user.address)
  const vault = await dragonHybrid.vault()

  expect(userBalanceDragon).to.be.greaterThanOrEqual(details.lockupAmount)
  expect(userBalanceTitan).to.be.greaterThanOrEqual(details.mintFee)
  expect(await dragonX.balanceOf(await dragonHybrid.getAddress())).to.be.equal(vault)

  const expectedUserBalanceTitan = userBalanceTitan - details.mintFee
  const expectedUserBalanceDragon = userBalanceDragon - details.lockupAmount
  const expectedVault = vault + details.lockupAmount
  const expectedDragonVault = await dragonX.vault() + details.mintFee

  await prepareMintNft(fixture, dragonType)
  await expect(dragonHybrid.connect(user).mint(dragonType))
    .to.emit(dragonHybrid, 'Minted')
    .withArgs(
      user.address,
      anyValue,
      dragonType,
      details.lockupAmount,
      details.mintFee,
    )

  expect(await titanX.balanceOf(user.address)).to.be.equal(expectedUserBalanceTitan)
  expect(await dragonX.balanceOf(user.address)).to.be.equal(expectedUserBalanceDragon)
  expect(await dragonHybrid.vault()).to.be.equal(expectedVault)
  expect(await dragonX.vault()).to.be.equal(expectedDragonVault)
}

describe('Mint', () => {
  it('Should revert on an invalid Dragon Type', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    await prepareMintNft(fixture, Constants.DragonTypes.Samurai)

    await expect(fixture.dragonHybrid.connect(fixture.user).mint(Constants.DragonTypes.Invalid)).to.be.reverted
  })
  it('Should mint a Ninja NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    await mintNft(fixture, Constants.DragonTypes.Ninja)
  })
  it('Should mint a Apprentice NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    await mintNft(fixture, Constants.DragonTypes.Apprentice)
  })
  it('Should mint a Emperor NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    await mintNft(fixture, Constants.DragonTypes.Emperor)
  })
  it('Should mint a Shogun NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    await mintNft(fixture, Constants.DragonTypes.Shogun)
  })
  it('Should mint a Samurai NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    await mintNft(fixture, Constants.DragonTypes.Samurai)
  })
  it('Should update state correctly when minting two Samurai NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    const vault = await fixture.dragonHybrid.vault()
    const details = getDragonDetails(Constants.DragonTypes.Samurai)
    const expectedVault = vault + details.lockupAmount * 2n

    await mintNft(fixture, Constants.DragonTypes.Samurai)
    await mintNft(fixture, Constants.DragonTypes.Samurai)

    expect(await fixture.dragonHybrid.vault()).to.be.equal(expectedVault)
  })
  it('Should update state correctly when minting different NFTs', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    const vault = await fixture.dragonHybrid.vault()
    const expectedVault = vault +
      getDragonDetails(Constants.DragonTypes.Samurai).lockupAmount +
      getDragonDetails(Constants.DragonTypes.Ninja).lockupAmount

    await mintNft(fixture, Constants.DragonTypes.Samurai)
    await mintNft(fixture, Constants.DragonTypes.Ninja)

    expect(await fixture.dragonHybrid.vault()).to.be.equal(expectedVault)
  })
})
