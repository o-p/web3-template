import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { ethers, network } from 'hardhat'

const wallet = ethers.Wallet.createRandom()

const template = `
# scripts/gen-wallet.ts generated this file at ${new Date().toISOString()}
DEFAULT_NETWORK="${network.name}"

# ${wallet.address}
PRIVATE_KEY="${wallet.privateKey}"
KEY="${wallet.privateKey}"

MNEMONIC="${wallet.mnemonic?.phrase}"
MNEMONIC_PHRASE="${wallet.mnemonic?.phrase}"
`

const filename = `${network.name.replace(/:/g, '-')}.${wallet.address}.env`

writeFileSync(join(__dirname, `../env`, filename), template.trimStart())

console.log(`Wallet env generated: ${filename}, wallet address: ${wallet.address}`)
