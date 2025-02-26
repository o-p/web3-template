import { task } from 'hardhat/config'

task('send', '傳送 ETH 到指定地址')
  .addPositionalParam('to', '接收地址')
  .addPositionalParam('amount', '金額 (ETH)', '0')
  .setAction(async ({ to, amount }, { ethers }) => {
    const value = ethers.parseEther(amount)
    if (!(value > 0n)) throw new Error('Invalid amount')
    if (!ethers.isAddress(to)) throw new Error('Invalid address')

    const [account] = await ethers.getSigners()
    const tx = await account.sendTransaction({ to, value })

    console.log(`Transaction hash: ${tx.hash}`)
  })
