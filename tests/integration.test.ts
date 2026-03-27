// Integration tests for Pixel Strategy

import { PixelStrategySDK } from '../src';

import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

import { AnchorProvider } from '@coral-xyz/anchor';

describe('Pixel Strategy Integration', () => {

  let sdk: PixelStrategySDK;

  let connection: Connection;

  let wallet: Keypair;

  beforeAll(async () => {

    connection = new Connection('http://localhost:8899', 'confirmed');

    wallet = Keypair.generate();

    // Airdrop SOL for testing

    const airdropSig = await connection.requestAirdrop(wallet.publicKey, 2 * LAMPORTS_PER_SOL);

    await connection.confirmTransaction(airdropSig);

    const provider = new AnchorProvider(connection, { publicKey: wallet.publicKey, signTransaction: async (tx) => tx, signAllTransactions: async (txs) => txs }, {});

    sdk = new PixelStrategySDK(connection, { publicKey: wallet.publicKey, signTransaction: async (tx) => { tx.sign(wallet); return tx; }, signAllTransactions: async (txs) => { txs.forEach(tx => tx.sign(wallet)); return txs; } });

  });

  it('initializes reserve', async () => {

    await sdk.initializeReserve();

    const info = await sdk.getReserveInfo();

    expect(info.totalDeposited.toNumber()).toBe(0);

  });

  it('deposits fee', async () => {

    const amount = 1000000; // 0.001 SOL

    await sdk.depositFee(amount);

    const info = await sdk.getReserveInfo();

    expect(info.totalDeposited.toNumber()).toBe(amount);

  });

});