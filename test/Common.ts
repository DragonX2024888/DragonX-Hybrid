import {
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

import { DragonHybrid as DragonNamespace } from '../typechain-types'

import { deployDragonHybridFixture, prepareBurnNft, prepareMintNft, prepareMintNftGenesis } from './Fixture'
import * as Constants from './Constants'

describe('Common Tests', () => {
  it('Should revert when fallback function is triggered on DragonHybrid', async () => {
    const { dragonHybrid, genesis } = await loadFixture(deployDragonHybridFixture)
    await expect(genesis.sendTransaction({
      to: await dragonHybrid.getAddress(), data: '0x1234',
    })).to.be.reverted
  })
  it('Should revert if a user sends ETH on DragonHybrid', async () => {
    const { user, dragonHybrid } = await loadFixture(deployDragonHybridFixture)
    await expect(user.sendTransaction({
      to: await dragonHybrid.getAddress(), value: ethers.parseEther('1'),
    })).to.be.reverted
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
    const { user, dragonHybrid } = fixture

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

    expect(await dragonHybrid.tokenURI(1))
      .to.be.equal(
        `ipfs://bafybeid2kp3p4k45ypzjpdixncjl7qabvh54byw4v46lenrrgksbiwcozm/${Constants.DragonTypes.Samurai}`,
      )
    expect(await dragonHybrid.tokenURI(2))
      .to.be.equal(
        `ipfs://bafybeid2kp3p4k45ypzjpdixncjl7qabvh54byw4v46lenrrgksbiwcozm/${Constants.DragonTypes.Ninja}`,
      )
    expect(await dragonHybrid.tokenURI(3))
      .to.be.equal(
        `ipfs://bafybeid2kp3p4k45ypzjpdixncjl7qabvh54byw4v46lenrrgksbiwcozm/${Constants.DragonTypes.Apprentice}`,
      )
    expect(await dragonHybrid.tokenURI(4))
      .to.be.equal(
        `ipfs://bafybeid2kp3p4k45ypzjpdixncjl7qabvh54byw4v46lenrrgksbiwcozm/${Constants.DragonTypes.Emperor}`,
      )
    expect(await dragonHybrid.tokenURI(5))
      .to.be.equal(
        `ipfs://bafybeid2kp3p4k45ypzjpdixncjl7qabvh54byw4v46lenrrgksbiwcozm/${Constants.DragonTypes.Shogun}`,
      )
    expect(await dragonHybrid.tokenURI(6))
      .to.be.equal(
        `ipfs://bafybeid2kp3p4k45ypzjpdixncjl7qabvh54byw4v46lenrrgksbiwcozm/${Constants.DragonTypes.Samurai}`,
      )
    expect(await dragonHybrid.tokenURI(7))
      .to.be.equal(
        `ipfs://bafybeid2kp3p4k45ypzjpdixncjl7qabvh54byw4v46lenrrgksbiwcozm/${Constants.DragonTypes.Ninja}`,
      )
    expect(await dragonHybrid.tokenURI(8))
      .to.be.equal(
        `ipfs://bafybeid2kp3p4k45ypzjpdixncjl7qabvh54byw4v46lenrrgksbiwcozm/${Constants.DragonTypes.Apprentice}`,
      )
    expect(await dragonHybrid.tokenURI(9))
      .to.be.equal(
        `ipfs://bafybeid2kp3p4k45ypzjpdixncjl7qabvh54byw4v46lenrrgksbiwcozm/${Constants.DragonTypes.Emperor}`,
      )
    expect(await dragonHybrid.tokenURI(10))
      .to.be.equal(
        `ipfs://bafybeid2kp3p4k45ypzjpdixncjl7qabvh54byw4v46lenrrgksbiwcozm/${Constants.DragonTypes.Shogun}`,
      )
  })
  it('Should revert when trying to query base URI for non existing NFT', async () => {
    const { dragonHybrid } = await loadFixture(deployDragonHybridFixture)
    await expect(dragonHybrid.tokenURI(1)).to.be.revertedWithCustomError(dragonHybrid, 'ERC721NonexistentToken').withArgs(1)
  })
  it('Should return a detailed ownership information', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    const { user, dragonHybrid, genesis, others } = fixture

    const ownerInfoUser = [
      [[2n, 4n, 11n], 3n],
      [[3n], 1n],
      [[5n, 6n, 9n], 3n],
      [[7n, 8n], 2n],
      [[1n], 1n],
    ] as DragonNamespace.DragonOwnerInfoStructOutput

    const ownerInfoGenesis = [
      [[10n], 1n],
      [[], 0n] as any as DragonNamespace.DragonOwnerDetailsStructOutput,
      [[], 0n] as any as DragonNamespace.DragonOwnerDetailsStructOutput,
      [[], 0n] as any as DragonNamespace.DragonOwnerDetailsStructOutput,
      [[], 0n] as any as DragonNamespace.DragonOwnerDetailsStructOutput,
    ] as DragonNamespace.DragonOwnerInfoStructOutput

    // this user does not mint but gets an NFT send by the user
    const ownerInfoOtherUser = [
      [[], 0n] as any as DragonNamespace.DragonOwnerDetailsStructOutput,
      [[12n], 1n],
      [[], 0n] as any as DragonNamespace.DragonOwnerDetailsStructOutput,
      [[], 0n] as any as DragonNamespace.DragonOwnerDetailsStructOutput,
      [[], 0n] as any as DragonNamespace.DragonOwnerDetailsStructOutput,
    ] as DragonNamespace.DragonOwnerInfoStructOutput

    // 1
    await prepareMintNft(fixture, Constants.DragonTypes.Emperor)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Emperor)
    // 2
    await prepareMintNft(fixture, Constants.DragonTypes.Apprentice)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Apprentice)
    // 3
    await prepareMintNft(fixture, Constants.DragonTypes.Ninja)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Ninja)
    // 4
    await prepareMintNft(fixture, Constants.DragonTypes.Apprentice)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Apprentice)
    // 5
    await prepareMintNft(fixture, Constants.DragonTypes.Samurai)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Samurai)
    // 6
    await prepareMintNft(fixture, Constants.DragonTypes.Samurai)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Samurai)
    // 7
    await prepareMintNft(fixture, Constants.DragonTypes.Shogun)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Shogun)
    // 8
    await prepareMintNft(fixture, Constants.DragonTypes.Shogun)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Shogun)
    // 9
    await prepareMintNft(fixture, Constants.DragonTypes.Samurai)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Samurai)
    // 10
    await prepareMintNftGenesis(fixture, Constants.DragonTypes.Apprentice)
    await dragonHybrid.connect(genesis).mint(Constants.DragonTypes.Apprentice)
    // 11
    await prepareMintNft(fixture, Constants.DragonTypes.Apprentice)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Apprentice)
    // 12
    await prepareMintNft(fixture, Constants.DragonTypes.Ninja)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Ninja)

    // Transfer NFT to other user account
    await dragonHybrid.connect(user).transferFrom(user.address, others[0].address, 12n)

    expect(await dragonHybrid.dragonsOfOwner(user.address)).to.eql(ownerInfoUser)
    expect(await dragonHybrid.dragonsOfOwner(genesis.address)).to.eql(ownerInfoGenesis)
    expect(await dragonHybrid.dragonsOfOwner(others[0].address)).to.eql(ownerInfoOtherUser)

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.equal(4n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Samurai)).to.equal(3n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Shogun)).to.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Emperor)).to.equal(1n)

    await prepareBurnNft(fixture, 1n)
    await dragonHybrid.connect(user).burn(1n)
    await prepareBurnNft(fixture, 3n)
    await dragonHybrid.connect(user).burn(3n)
    await prepareBurnNft(fixture, 5n)
    await dragonHybrid.connect(user).burn(5n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.equal(4n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.equal(1n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Samurai)).to.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Shogun)).to.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Emperor)).to.equal(0n)
  })
  it('should track total supply of dragons', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    const { user, dragonHybrid } = fixture

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.be.equal(0n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.be.equal(0n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Samurai)).to.be.equal(0n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Shogun)).to.be.equal(0n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Emperor)).to.be.equal(0n)

    await prepareMintNft(fixture, Constants.DragonTypes.Apprentice)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Apprentice)
    await prepareMintNft(fixture, Constants.DragonTypes.Ninja)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Ninja)
    await prepareMintNft(fixture, Constants.DragonTypes.Samurai)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Samurai)
    await prepareMintNft(fixture, Constants.DragonTypes.Shogun)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Shogun)
    await prepareMintNft(fixture, Constants.DragonTypes.Emperor)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Emperor)

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.be.equal(1n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.be.equal(1n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Samurai)).to.be.equal(1n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Shogun)).to.be.equal(1n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Emperor)).to.be.equal(1n)

    await prepareMintNft(fixture, Constants.DragonTypes.Apprentice)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Apprentice)
    await prepareMintNft(fixture, Constants.DragonTypes.Ninja)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Ninja)
    await prepareMintNft(fixture, Constants.DragonTypes.Samurai)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Samurai)
    await prepareMintNft(fixture, Constants.DragonTypes.Shogun)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Shogun)

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.be.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.be.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Samurai)).to.be.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Shogun)).to.be.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Emperor)).to.be.equal(1n)

    await prepareBurnNft(fixture, 9n)
    await dragonHybrid.connect(user).burn(9n)
    await prepareBurnNft(fixture, 8n)
    await dragonHybrid.connect(user).burn(8n)
    await prepareBurnNft(fixture, 7n)
    await dragonHybrid.connect(user).burn(7n)
    await prepareBurnNft(fixture, 6n)
    await dragonHybrid.connect(user).burn(6n)

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.be.equal(1n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.be.equal(1n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Samurai)).to.be.equal(1n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Shogun)).to.be.equal(1n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Emperor)).to.be.equal(1n)

    await prepareBurnNft(fixture, 5n)
    await dragonHybrid.connect(user).burn(5n)
    await prepareBurnNft(fixture, 4n)
    await dragonHybrid.connect(user).burn(4n)
    await prepareBurnNft(fixture, 3n)
    await dragonHybrid.connect(user).burn(3n)
    await prepareBurnNft(fixture, 2n)
    await dragonHybrid.connect(user).burn(2n)
    await prepareBurnNft(fixture, 1n)
    await dragonHybrid.connect(user).burn(1n)

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.be.equal(0n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.be.equal(0n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Samurai)).to.be.equal(0n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Shogun)).to.be.equal(0n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Emperor)).to.be.equal(0n)
  })
  it('should track dragon balances on transfer', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    const { user, dragonHybrid, others } = fixture
    const otherUser = others[0]

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.be.equal(0n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.be.equal(0n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Apprentice)).to.be.equal(0n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Ninja)).to.be.equal(0n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Apprentice)).to.be.equal(0n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Ninja)).to.be.equal(0n)

    await prepareMintNft(fixture, Constants.DragonTypes.Apprentice)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Apprentice)
    await prepareMintNft(fixture, Constants.DragonTypes.Apprentice)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Apprentice)
    await prepareMintNft(fixture, Constants.DragonTypes.Ninja)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Ninja)
    await prepareMintNft(fixture, Constants.DragonTypes.Ninja)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Ninja)

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.be.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.be.equal(2n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Apprentice)).to.be.equal(2n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Ninja)).to.be.equal(2n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Apprentice)).to.be.equal(0n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Ninja)).to.be.equal(0n)

    await dragonHybrid.connect(user).transferFrom(user.address, otherUser.address, 1n)
    await dragonHybrid.connect(user).transferFrom(user.address, otherUser.address, 3n)

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.be.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.be.equal(2n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Apprentice)).to.be.equal(1n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Ninja)).to.be.equal(1n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Apprentice)).to.be.equal(1n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Ninja)).to.be.equal(1n)

    await dragonHybrid.connect(user).transferFrom(user.address, otherUser.address, 2n)
    await dragonHybrid.connect(user).transferFrom(user.address, otherUser.address, 4n)

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.be.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.be.equal(2n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Apprentice)).to.be.equal(0n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Ninja)).to.be.equal(0n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Apprentice)).to.be.equal(2n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Ninja)).to.be.equal(2n)

    await dragonHybrid.connect(otherUser).transferFrom(otherUser.address, user.address, 1n)
    await dragonHybrid.connect(otherUser).transferFrom(otherUser.address, user.address, 3n)

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.be.equal(2n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.be.equal(2n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Apprentice)).to.be.equal(1n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Ninja)).to.be.equal(1n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Apprentice)).to.be.equal(1n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Ninja)).to.be.equal(1n)

    await prepareBurnNft(fixture, 1n)
    await dragonHybrid.connect(user).burn(1n)
    await prepareBurnNft(fixture, 3n)
    await dragonHybrid.connect(user).burn(3n)

    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Apprentice)).to.be.equal(1n)
    expect(await dragonHybrid.totalSupplyPerDragon(Constants.DragonTypes.Ninja)).to.be.equal(1n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Apprentice)).to.be.equal(0n)
    expect(await dragonHybrid.balanceOfDragon(user.address, Constants.DragonTypes.Ninja)).to.be.equal(0n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Apprentice)).to.be.equal(1n)
    expect(await dragonHybrid.balanceOfDragon(otherUser.address, Constants.DragonTypes.Ninja)).to.be.equal(1n)
  })
  it('Should revert if trying to query the dragon type for token-id 0', async () => {
    const { dragonHybrid } = await loadFixture(deployDragonHybridFixture)
    await expect(dragonHybrid.tokenIdToDragonType(0n)).to.be.revertedWithCustomError(dragonHybrid, 'ERC721NonexistentToken')
  })
  it('Should revert if trying to query the dragon type for a burned token ID', async () => {
    const fixture = await loadFixture(deployDragonHybridFixture)
    const { user, dragonHybrid } = fixture

    await prepareMintNft(fixture, Constants.DragonTypes.Apprentice)
    await dragonHybrid.connect(user).mint(Constants.DragonTypes.Apprentice)
    expect(await dragonHybrid.tokenIdToDragonType(1n)).to.be.equal(Constants.DragonTypes.Apprentice)

    await prepareBurnNft(fixture, 1n)
    await dragonHybrid.connect(user).burn(1n)
    await expect(dragonHybrid.tokenIdToDragonType(0n)).to.be.revertedWithCustomError(dragonHybrid, 'ERC721NonexistentToken')
  })
})
