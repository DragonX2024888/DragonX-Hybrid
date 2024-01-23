import {
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'

import { deployDragonHybridFixture } from './Fixture'

describe('BurnProxy', () => {
  it('Should not revert if no tokens to burn', async () => {
    const { dragonBurnProxy } = await loadFixture(deployDragonHybridFixture)
    expect(await dragonBurnProxy.totalDragonBurned()).to.be.equal(0n)
    await expect(dragonBurnProxy.burn()).to.not.be.reverted
    expect(await dragonBurnProxy.totalDragonBurned()).to.be.equal(0n)
  })
  it('Should burn all tokens hold by the burn proxy, emit events and update state', async () => {
    const { dragonBurnProxy, dragonX, user } = await loadFixture(deployDragonHybridFixture)
    const totalSupply = await dragonX.totalSupply()
    const userBalance = await dragonX.balanceOf(user.address)
    const toBurn = userBalance * 100n / 200n
    const expectedSupply = totalSupply - userBalance

    expect(await dragonBurnProxy.totalDragonBurned()).to.be.equal(0n)
    expect(await dragonX.balanceOf(await dragonBurnProxy.getAddress())).to.be.equal(0n)

    // Send total balance of user to burn proxy
    await dragonX.connect(user).transfer(await dragonBurnProxy.getAddress(), toBurn)

    expect(await dragonBurnProxy.totalDragonBurned()).to.be.equal(0n)
    expect(await dragonX.balanceOf(user.address)).to.be.equal(userBalance - toBurn)
    expect(await dragonX.balanceOf(await dragonBurnProxy.getAddress())).to.be.equal(toBurn)

    // Burn
    await expect(dragonBurnProxy.connect(user).burn()).to.emit(dragonBurnProxy, 'Burned').withArgs(user.address, toBurn)

    // State
    expect(await dragonBurnProxy.totalDragonBurned()).to.be.equal(toBurn)
    expect(await dragonX.balanceOf(await dragonBurnProxy.getAddress())).to.be.equal(0n)

    // Second burn
    await dragonX.connect(user).transfer(await dragonBurnProxy.getAddress(), toBurn)

    expect(await dragonBurnProxy.totalDragonBurned()).to.be.equal(toBurn)
    expect(await dragonX.balanceOf(user.address)).to.be.equal(userBalance - 2n * toBurn)
    expect(await dragonX.balanceOf(await dragonBurnProxy.getAddress())).to.be.equal(toBurn)

    // Burn
    await expect(dragonBurnProxy.connect(user).burn()).to.emit(dragonBurnProxy, 'Burned').withArgs(user.address, toBurn)

    // State
    expect(await dragonBurnProxy.totalDragonBurned()).to.be.equal(toBurn * 2n)
    expect(await dragonX.balanceOf(await dragonBurnProxy.getAddress())).to.be.equal(0n)

    // Final
    expect(await dragonX.totalSupply()).to.be.equal(expectedSupply)
  })
})
