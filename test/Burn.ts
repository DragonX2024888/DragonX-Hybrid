import {
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'

import { deployDragonHybridFixture, prepareMintNft, prepareBurnNft, getDragonDetails, Fixture } from './Fixture'
import * as Constants from './Constants'

async function mintNft(fixture: Fixture, dragonType: Constants.DragonTypes) {
  const { user, dragonHybrid } = fixture
  await prepareMintNft(fixture, dragonType)
  await dragonHybrid.connect(user).mint(dragonType)
}

async function burnNft(fixture: Fixture, tokenId: bigint, expectedDragonType: Constants.DragonTypes) {
  const { user, titanX, dragonX, dragonHybrid, dragonBurnProxy } = fixture
  const dragonType = Constants.toDragonTypeEnum(await dragonHybrid.tokenIdToDragonType(tokenId))
  expect(dragonType).to.be.equal(expectedDragonType)
  const details = getDragonDetails(dragonType)
  const userTitanBalance = await titanX.balanceOf(user.address)
  const userDragonBalance = await dragonX.balanceOf(user.address)
  expect(userDragonBalance).to.be.greaterThanOrEqual(details.burnFee)
  const expectedUserTitanBalance = userTitanBalance
  const expectedUserDragonBalance = userDragonBalance + details.lockupAmount - details.burnFee
  const expectedVault = await dragonHybrid.vault() - details.lockupAmount
  const expectedTotalSupply = await dragonX.totalSupply() - details.burnFee
  const expectedBurnProxy = await dragonBurnProxy.totalDragonBurned() + details.burnFee

  await prepareBurnNft(fixture, tokenId)
  await expect(dragonHybrid.connect(user).burn(tokenId))
    .to.emit(dragonHybrid, 'Burned')
    .withArgs(
      user.address,
      tokenId,
      dragonType,
      details.lockupAmount,
      details.burnFee,
    )

  expect(await titanX.balanceOf(user.address)).to.be.equal(expectedUserTitanBalance)
  expect(await dragonX.balanceOf(user.address)).to.be.equal(expectedUserDragonBalance)
  expect(await dragonHybrid.vault()).to.be.equal(expectedVault)
  expect(await dragonX.totalSupply()).to.be.equal(expectedTotalSupply)
  expect(await dragonBurnProxy.totalDragonBurned()).to.be.equal(expectedBurnProxy)
}

describe('Burn', () => {
  it('Should burn a Ninja NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    await mintNft(fixture, Constants.DragonTypes.Ninja)
    await burnNft(fixture, 1n, Constants.DragonTypes.Ninja)
  })
  it('Should burn a Apprentice NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    await mintNft(fixture, Constants.DragonTypes.Apprentice)
    await burnNft(fixture, 1n, Constants.DragonTypes.Apprentice)
  })
  it('Should burn a Emperor NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    await mintNft(fixture, Constants.DragonTypes.Emperor)
    await burnNft(fixture, 1n, Constants.DragonTypes.Emperor)
  })
  it('Should burn a Shogun NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    await mintNft(fixture, Constants.DragonTypes.Shogun)
    await burnNft(fixture, 1n, Constants.DragonTypes.Shogun)
  })
  it('Should burn a Samurai NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    await mintNft(fixture, Constants.DragonTypes.Samurai)
    await burnNft(fixture, 1n, Constants.DragonTypes.Samurai)
  })
  it('Should allow to burn an NFT after ownership has been transfered', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    const { dragonX, dragonHybrid, user, others } = fixture
    const otherUser = others[0]

    await mintNft(fixture, Constants.DragonTypes.Apprentice)

    // Transfer
    await dragonHybrid.connect(user).transferFrom(user.address, otherUser.address, 1n)

    // Prepare Burn
    const dragonHybridAddress = await dragonHybrid.getAddress()
    const details = getDragonDetails(Constants.DragonTypes.Apprentice)
    await dragonX.connect(user).transfer(otherUser.address, details.burnFee)
    await dragonX.connect(otherUser).approve(dragonHybridAddress, details.burnFee)

    // Burn
    await expect(dragonHybrid.connect(user).burn(1n)).to.be.reverted
    await expect(dragonHybrid.connect(otherUser).burn(1n)).to.not.be.reverted
  })
  it('Should always send locked DragonX to the owner', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    const { dragonX, dragonHybrid, burnDragonHybridProxy, user } = fixture
    const details = getDragonDetails(Constants.DragonTypes.Apprentice)

    // Mint
    await mintNft(fixture, Constants.DragonTypes.Apprentice)
    expect(await dragonX.balanceOf(await burnDragonHybridProxy.getAddress())).to.be.equal(0n)

    const balance = await dragonX.balanceOf(user.address)
    const expectedBalance = balance + details.lockupAmount - details.burnFee

    // Prepare the burn
    await dragonX.connect(user).transfer(await burnDragonHybridProxy.getAddress(), details.burnFee)
    await dragonHybrid.connect(user).approve(await burnDragonHybridProxy.getAddress(), 1n)

    // Burn through another authorised contract
    await burnDragonHybridProxy.connect(user)
      .burn(1n, details.burnFee, await dragonHybrid.getAddress(), await dragonX.getAddress())

    expect(await dragonX.balanceOf(user.address)).to.be.equal(expectedBalance)
    expect(await dragonX.balanceOf(await burnDragonHybridProxy.getAddress())).to.be.equal(0n)
  })
  it('Should update state correctly when burning two Samurai NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    const vault = await fixture.dragonHybrid.vault()
    const expectedVault = vault

    await mintNft(fixture, Constants.DragonTypes.Samurai)
    await mintNft(fixture, Constants.DragonTypes.Samurai)
    await burnNft(fixture, 1n, Constants.DragonTypes.Samurai)
    await burnNft(fixture, 2n, Constants.DragonTypes.Samurai)

    expect(await fixture.dragonHybrid.vault()).to.be.equal(expectedVault)
  })
  it('Should update state correctly when minting different NFTs', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    const vault = await fixture.dragonHybrid.vault()
    const expectedVault = vault

    await mintNft(fixture, Constants.DragonTypes.Samurai)
    await mintNft(fixture, Constants.DragonTypes.Ninja)
    await burnNft(fixture, 1n, Constants.DragonTypes.Samurai)
    await burnNft(fixture, 2n, Constants.DragonTypes.Ninja)

    expect(await fixture.dragonHybrid.vault()).to.be.equal(expectedVault)
  })
  it('Should revert when trying to burn an already burned NFT', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)

    await mintNft(fixture, Constants.DragonTypes.Samurai)
    await burnNft(fixture, 1n, Constants.DragonTypes.Samurai)

    await expect(fixture.dragonHybrid.connect(fixture.user).burn(1n))
      .to.be.revertedWithCustomError(fixture.dragonHybrid, 'ERC721NonexistentToken')
      .withArgs(1n)
  })
  it('Should revert when trying to burn an NFT which is not owned by caller', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)

    await mintNft(fixture, Constants.DragonTypes.Samurai)
    await expect(fixture.dragonHybrid.connect(fixture.others[0]).burn(1n))
      .to.be.revertedWithCustomError(fixture.dragonHybrid, 'ERC721InsufficientApproval')
      .withArgs(fixture.others[0].address, 1n)
  })
})
