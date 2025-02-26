import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

import { deployDev } from './Dev.fixture'

describe('Dev', function () {
  it('Should deploy success', async function () {
    const dev = await loadFixture(deployDev)

    const [admin] = await ethers.getSigners()
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(dev.target).to.be.properAddress
    expect(await dev.owner()).to.equal(admin.address)

    expect(await dev.getNonce()).to.gt(0)
  })

  it('Should get same erc7201 result', async function () {
    const dev = await loadFixture(deployDev)
    expect(await dev.erc7201('o-p.dev')).to.equal(
      '0xa271e4d70da084cff0347348fcf177546cc0002dfe43a589d0b6b4b6d3477b00'
    )
  })
})
