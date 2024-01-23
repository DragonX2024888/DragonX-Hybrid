import {
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

import { deployDragonHybridFixture, prepareMintNft } from './Fixture'
import * as Constants from './Constants'

describe('Common Tests', () => {
  it('Should revert when fallback function is triggered on DragonHybrid', async () => {
    const { dragonHybrid, genesis } = await loadFixture(deployDragonHybridFixture)
    await expect(genesis.sendTransaction({
      to: await dragonHybrid.getAddress(), data: '0x1234',
    })).to.be.revertedWith('noop')
  })
  it('Should revert if a user sends ETH on DragonHybrid', async () => {
    const { user, dragonHybrid } = await loadFixture(deployDragonHybridFixture)
    await expect(user.sendTransaction({
      to: await dragonHybrid.getAddress(), value: ethers.parseEther('1'),
    })).to.be.revertedWith('noop')
  })
  it('Should revert when fallback function is triggered on DragonBurnProxy', async () => {
    const { dragonBurnProxy, genesis } = await loadFixture(deployDragonHybridFixture)
    await expect(genesis.sendTransaction({
      to: await dragonBurnProxy.getAddress(), data: '0x1234',
    })).to.be.revertedWith('noop')
  })
  it('Should revert if a user sends ETH on DragonBurnProxy', async () => {
    const { user, dragonBurnProxy } = await loadFixture(deployDragonHybridFixture)
    await expect(user.sendTransaction({
      to: await dragonBurnProxy.getAddress(), value: ethers.parseEther('1'),
    })).to.be.revertedWith('noop')
  })
  it('Should revert when deploying with invalid DragonBurnProxy address', async () => {
    const DragonHybrid = await ethers.getContractFactory('DragonHybrid')
    await expect(DragonHybrid.deploy('https://test.com', Constants.ADDRESS_ZERO)).to.be.revertedWith('invalid burn proxy')
  })
  it('Should revert when deploying with empty base URI', async () => {
    const DragonHybrid = await ethers.getContractFactory('DragonHybrid')
    await expect(DragonHybrid.deploy('', Constants.TITANX_ADDRESS)).to.be.revertedWith('invalid base URI')
  })
  it('Should only allow genesis to set the base URI', async () => {
    const { dragonHybrid, genesis, user } = await loadFixture(deployDragonHybridFixture)
    await expect(dragonHybrid.connect(genesis).setBaseURI('https://test.com')).to.not.be.reverted
    await expect(dragonHybrid.connect(user).setBaseURI('https://test.com')).to.be.revertedWithCustomError(dragonHybrid, 'OwnableUnauthorizedAccount')
  })
  it('Should revert when setting empty base URI', async () => {
    const { dragonHybrid, genesis } = await loadFixture(deployDragonHybridFixture)
    await expect(dragonHybrid.connect(genesis).setBaseURI('')).to.be.revertedWith('invalid base URI')
  })
  it('Should return base URI based on Dragon Type', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    const { user, dragonHybrid, genesis } = fixture
    await dragonHybrid.connect(genesis).setBaseURI('https://test.com/')

    await prepareMintNft(fixture, Constants.DragonTypes.Samurai)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Samurai)
    await prepareMintNft(fixture, Constants.DragonTypes.Ninja)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Ninja)
    await prepareMintNft(fixture, Constants.DragonTypes.Apprentice)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Apprentice)
    await prepareMintNft(fixture, Constants.DragonTypes.Emperor)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Emperor)
    await prepareMintNft(fixture, Constants.DragonTypes.Shogun)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Shogun)
    await prepareMintNft(fixture, Constants.DragonTypes.Samurai)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Samurai)
    await prepareMintNft(fixture, Constants.DragonTypes.Ninja)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Ninja)
    await prepareMintNft(fixture, Constants.DragonTypes.Apprentice)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Apprentice)
    await prepareMintNft(fixture, Constants.DragonTypes.Emperor)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Emperor)
    await prepareMintNft(fixture, Constants.DragonTypes.Shogun)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Shogun)

    expect(await dragonHybrid.tokenURI(1)).to.be.equal(`https://test.com/${Constants.DragonTypes.Samurai}`)
    expect(await dragonHybrid.tokenURI(2)).to.be.equal(`https://test.com/${Constants.DragonTypes.Ninja}`)
    expect(await dragonHybrid.tokenURI(3)).to.be.equal(`https://test.com/${Constants.DragonTypes.Apprentice}`)
    expect(await dragonHybrid.tokenURI(4)).to.be.equal(`https://test.com/${Constants.DragonTypes.Emperor}`)
    expect(await dragonHybrid.tokenURI(5)).to.be.equal(`https://test.com/${Constants.DragonTypes.Shogun}`)
    expect(await dragonHybrid.tokenURI(6)).to.be.equal(`https://test.com/${Constants.DragonTypes.Samurai}`)
    expect(await dragonHybrid.tokenURI(7)).to.be.equal(`https://test.com/${Constants.DragonTypes.Ninja}`)
    expect(await dragonHybrid.tokenURI(8)).to.be.equal(`https://test.com/${Constants.DragonTypes.Apprentice}`)
    expect(await dragonHybrid.tokenURI(9)).to.be.equal(`https://test.com/${Constants.DragonTypes.Emperor}`)
    expect(await dragonHybrid.tokenURI(10)).to.be.equal(`https://test.com/${Constants.DragonTypes.Shogun}`)
  })
  it('Should revert when trying to query base URI for non existing NFT', async () => {
    const { dragonHybrid } = await loadFixture(deployDragonHybridFixture)
    await expect(dragonHybrid.tokenURI(1)).to.be.revertedWithCustomError(dragonHybrid, 'ERC721NonexistentToken').withArgs(1)
  })
})
