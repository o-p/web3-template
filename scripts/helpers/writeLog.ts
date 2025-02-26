import { mkdirSync, writeFileSync } from 'node:fs'
import { join, parse, relative } from 'node:path'

import { network } from 'hardhat'

const root = join(__dirname, '../..')
const {
  name: chainName,
  config: { chainId },
} = network

/**
 * @example writeLog({ hello: 'world' }, __filename)
 *
 * @param log Any object to be logged
 * @param fileName Put __filename here
 */
export async function writeLog(log: Record<string, unknown>, fileName: string) {
  const baseName = parse(fileName).name
  const dirName = join(__dirname, `../../logs/${baseName}`)
  const output = join(dirName, `${chainName}#${chainId}@${new Date().toISOString()}.json`)

  mkdirSync(dirName, { recursive: true })
  writeFileSync(
    output,
    JSON.stringify(
      {
        chainId,
        network: chainName,
        ...log,
      },
      null,
      2
    )
  )

  return relative(root, output)
}
