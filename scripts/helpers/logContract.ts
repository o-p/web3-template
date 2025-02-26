import Debug from 'debug'
import { Contract } from 'ethers'
import { ethers } from 'hardhat'

const debug = Debug(`app:log-contract`)

type LogContractOptions = {
  name?: string
}

export async function logContract(contract: Contract, opt: LogContractOptions = {}) {
  const tx = contract.deploymentTransaction()

  if (!tx) {
    debug('傳入的合約並非透過 Factory 部署, 無法取得 deploy transaction hash')
    return {
      ...opt,
      address: contract.target,
    }
  }

  const deployTx = await ethers.provider.getTransaction(tx.hash)

  return {
    ...opt,
    address: contract.target,
    transactionHash: tx?.hash,
    blockNumber: deployTx?.blockNumber,
  }
}
