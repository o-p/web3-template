import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

import deployERC20 from './DevERC20.fixtures'

describe('DevERC20', function () {
  it('should mint to admin account', async function () {
    const [admin] = await ethers.getSigners()
    const erc20 = await loadFixture(deployERC20())

    const totalSupply = await erc20.totalSupply()
    expect(await erc20.balanceOf(admin.address)).to.equal(totalSupply)
  })
})
