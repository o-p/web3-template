import { ethers } from 'hardhat'

export const deployDev = async () => {
  const dev = await ethers.deployContract('Dev', [])
  return dev
}
