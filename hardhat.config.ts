import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import Debug from 'debug'
import { config as dotenvConfig } from 'dotenv'
import { parseEther } from 'ethers'
import 'hardhat-abi-exporter'
import type { HardhatUserConfig } from 'hardhat/config'
import type { HttpNetworkAccountsUserConfig } from 'hardhat/types'

import './tasks'

const debug = Debug('app:config')
const env = dotenvConfig()

if (env.error) debug('Failed to load .env file')

const Params = {
  DefaultNetwork: process.env.DEFAULT_NETWORK ?? 'hardhat',
  PrivateKey: process.env.PRIVATE_KEY ?? process.env.KEY ?? '',
  MnemonicPhrase: process.env.MNEMONIC_PHRASE ?? process.env.MNEMONIC ?? '',
  MnemonicPath: process.env.MNEMONIC_PATH ?? `m/44'/60'/0'/0/`, // 最後 index 位留空
  MnemonicPassword: process.env.MNEMONIC_PASSWORD ?? '',
  MnemonicInitialIndex: parseInt(process.env.MNEMONIC_INITIAL_INDEX ?? '0', 10) || 0,
  ReportGas: Boolean(process.env.REPORT_GAS),
  DefaultMnemonic: 'test test test test test test test test test test test junk',
} as const

const accounts = parseAccounts(Params)

const config: HardhatUserConfig = {
  defaultNetwork: Params.DefaultNetwork,
  networks: {
    hardhat: {
      accounts: {
        mnemonic: Params.DefaultMnemonic,
        accountsBalance: `${parseEther('1000000')}`,
      },
      chainId: 31_337,
    },

    'base:sepolia': {
      accounts,
      chainId: 84_532,
      url: `https://sepolia.base.org`,
      gasMultiplier: 1.5,
    },
    'bnb:testnet': {
      accounts,
      chainId: 97,
      url: 'https://data-seed-prebsc-2-s1.binance.org:8545',
      gasPrice: 20e9,
    },
    'opbnb:testnet': {
      accounts,
      chainId: 5_611,
      url: `https://opbnb-testnet-rpc.bnbchain.org`,
      gasPrice: 1500000008, // 1.500000008 gwei
    },

    /** @see https://chainlist.org/chain/59141 */
    'linea:sepolia': {
      accounts,
      chainId: 59_141,
      url: `https://rpc.sepolia.linea.build`,
      // url: `https://linea-sepolia-rpc.publicnode.com`,
      // https://linea-sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
      // https://linea-sepolia.blockpi.network/v1/rpc/public
      // wss://linea-sepolia-rpc.publicnode.com
    },
    /** @see https://chainlist.org/chain/59144 */
    'linea:mainnet': {
      accounts,
      chainId: 59_144,
      url: `https://rpc.linea.build`,
    },

    'zytron:linea:sepolia': {
      accounts,
      chainId: 50_098,
      url: `https://rpc-testnet.zypher.network`,
    },
    'zytron:linea:mainnet': {
      accounts,
      chainId: 9_901,
      url: `https://rpc.zypher.network`,
    },

    // hardhat node
    local: {
      accounts: {
        mnemonic: Params.DefaultMnemonic,
      },
      chainId: 31_337,
      url: 'http://127.0.0.1:8545',
    },
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },
  solidity: {
    compilers: [
      {
        version: '0.8.28',
        settings: {
          metadata: {
            // Not including the metadata hash
            // https://github.com/paulrberg/solidity-template/issues/31
            bytecodeHash: 'none',
          },
          // Disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 200,
          },
          // evmVersion: 'default',
        },
      },
      // 如果有用到外部合約，有可能需要多個版本的編譯器:
      // {
      //   version: '0.8.12',
      //   settings: {
      //     metadata: { bytecodeHash: 'none' },
      //     optimizer: { enabled: true, runs: 200 },
      //   },
      // },
    ],
  },

  mocha: {
    bail: true,
  },

  abiExporter: {
    path: './build/abi',
    format: 'json',
    spacing: 2,
    clear: true,
    flat: true,
  },

  typechain: {
    outDir: 'build/types',
    target: 'ethers-v6',
  },

  gasReporter: {
    currency: 'USD',
    enabled: Params.ReportGas,
    excludeContracts: [],
  },
}

export default config

function parseAccounts(params: typeof Params): HttpNetworkAccountsUserConfig {
  if (params.MnemonicPhrase)
    return {
      mnemonic: params.MnemonicPhrase,
      initialIndex: params.MnemonicInitialIndex,
      count: 10,
      path: params.MnemonicPath,
      passphrase: params.MnemonicPassword,
    }

  if (params.PrivateKey) return [params.PrivateKey]

  debug('No wallet params in env, using default accounts')

  return {
    mnemonic: params.DefaultMnemonic,
    initialIndex: 0,
    count: 10,
  }
}
