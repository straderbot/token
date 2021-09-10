import * as uniswap from '@uniswap/sdk'
import * as hardhat from 'hardhat'
import { ethers, providers, Signer, Wallet } from 'ethers'
import { expect, use } from 'chai'

import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'

import { Eclair__factory, Eclair } from '../types'

// MARK: - Utilities

/**
 * The address of the WETH token.
 */
const WETH = uniswap.WETH[uniswap.ChainId.MAINNET].address
const UNISWAP = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

async function getWalletBalance(wallet: string): Promise<ethers.BigNumber> {
  const provider = hardhat.network.provider
  const res = await provider.send('eth_getBalance', [wallet, 'latest'])

  return ethers.BigNumber.from(res)
}

// MARK: - Set Up

use(hardhat.waffle.solidity)

// MARK: - Tests

describe('Eclair', function () {
  let accounts: Signer[]
  let eclair: Eclair

  beforeEach(async function () {
    accounts = await hardhat.ethers.getSigners()
  })

  // Contract setup
  beforeEach(async function () {
    const [owner] = accounts

    const factory = new Eclair__factory(owner)
    eclair = await factory.deploy()

    // Check that owner is always set right.
    expect(await eclair.owner()).to.equal(await owner.getAddress())
  })

  // Methods -----------------------------------------------------------------

  // MARK: - Sell

  it('reverts when not enough tokens', async () => {
    const [owner] = accounts

    console.log(await owner.getBalance())

    const token = '0x28Cca76f6e8eC81e4550ecd761f899110b060E97'
    const amount = hardhat.ethers.BigNumber.from(1).mul(hardhat.ethers.BigNumber.from(10).pow(18))

    const blockNumber = await owner.provider!.getBlockNumber()

    // await expect(tx).not.to.be.reverted
  })
})
