import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('DragonHybrid', (m) => {
  const dragonBurnProxy = m.contract('DragonBurnProxy')
  const dragonHybrid = m.contract('DragonHybrid', [m.getParameter('baseURI', ''), dragonBurnProxy])
  return { dragonHybrid, dragonBurnProxy }
})
