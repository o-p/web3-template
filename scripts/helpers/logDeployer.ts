import Debug from 'debug'
import { AddressLike } from 'ethers'
import { formatEther } from 'ethers'
import { ethers } from 'hardhat'

const debug = Debug(`app:log-deployer`)

async function info(addr: AddressLike) {
  const [balance, nonce] = await Promise.all([
    ethers.provider.getBalance(addr),
    ethers.provider.getTransactionCount(addr),
    // ethers.provider.getFeeData(),
  ])

  return {
    balance,
    nonce,
  }
}

export async function logDeployer() {
  const [deployer] = await ethers.getSigners()
  const info0 = await info(deployer.address)

  debug('Initial info: %O', info0)

  return async () => {
    const info1 = await info(deployer.address)
    debug('Final info: %O', info1)

    return {
      deployer: deployer.address,
      spent: `${formatEther(info0.balance - info1.balance)} ETH`,
      txCounts: info1.nonce - info0.nonce,
    }
  }
}
