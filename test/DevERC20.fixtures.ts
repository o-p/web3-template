import { ethers } from 'hardhat'

export const deployDevERC20 = (
  name: string = 'Dev Token',
  symbol: string = 'DEV',
  totalSupply: number = 10_000_000_000
) =>
  async function deployDevToken() {
    const ERC20 = await ethers.getContractFactory('DevERC20')
    const token = await ERC20.deploy(name, symbol, totalSupply)

    await token.waitForDeployment()

    return token
  }

export default deployDevERC20
