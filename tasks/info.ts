import { task } from 'hardhat/config'

task('info', '印出當前網路 & 錢包的各項資訊', async (_, { ethers, network }) => {
  const {
    config: { chainId },
    name,
  } = network
  console.log(`Network: ${name} (${chainId})`)

  const [account] = await ethers.getSigners()
  console.log(`Account: ${account.address}`)

  const balance = await ethers.provider.getBalance(account.address)
  console.log(`Balance: ${ethers.formatEther(balance)}`)

  const nonce = await ethers.provider.getTransactionCount(account.address)
  console.log(`Nonce: ${nonce}`)

  const info = await ethers.provider.getFeeData()
  if (info?.gasPrice) console.log(`Gas price: ${ethers.formatUnits(info.gasPrice, 'gwei')} gwei`)
})
