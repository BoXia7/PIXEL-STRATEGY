// Pixel Strategy TypeScript SDK

import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';

import idl from '../contracts/target/idl/pixel_strategy.json';

const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

export class PixelStrategySDK {

  program: Program;

  reservePda: PublicKey;

  constructor(connection: Connection, wallet: any) {

    const provider = new AnchorProvider(connection, wallet, {});

    this.program = new Program(idl as Idl, PROGRAM_ID, provider);

    [this.reservePda] = PublicKey.findProgramAddressSync(

      [Buffer.from('reserve')],

      PROGRAM_ID

    );

  }

  async initializeReserve() {

    return await this.program.methods.initializeReserve().accounts({

      reserve: this.reservePda,

      authority: this.program.provider.publicKey,

      systemProgram: SystemProgram.programId,

    }).rpc();

  }

  async depositFee(amount: number) {

    return await this.program.methods.depositFee(new anchor.BN(amount)).accounts({

      reserve: this.reservePda,

      user: this.program.provider.publicKey,

      systemProgram: SystemProgram.programId,

    }).rpc();

  }

  async getReserveInfo() {

    return await this.program.account.reserve.fetch(this.reservePda);

  }

}