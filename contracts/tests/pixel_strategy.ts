import * as anchor from "@coral-xyz/anchor";

import { Program } from "@coral-xyz/anchor";

import { PixelStrategy } from "../target/types/pixel_strategy";

import { expect } from "chai";

describe("pixel_strategy", () => {

  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const program = anchor.workspace.PixelStrategy as Program<PixelStrategy>;

  let reservePda: anchor.web3.PublicKey;

  let bump: number;

  before(async () => {

    [reservePda, bump] = await anchor.web3.PublicKey.findProgramAddress(

      [Buffer.from("reserve")],

      program.programId

    );

  });

  it("Initializes the reserve", async () => {

    const tx = await program.methods

      .initializeReserve()

      .accounts({

        reserve: reservePda,

        authority: provider.wallet.publicKey,

        systemProgram: anchor.web3.SystemProgram.programId,

      })

      .rpc();

    const reserveAccount = await program.account.reserve.fetch(reservePda);

    expect(reserveAccount.authority.toString()).to.equal(provider.wallet.publicKey.toString());

    expect(reserveAccount.totalDeposited.toNumber()).to.equal(0);

  });

  it("Deposits fee", async () => {

    const amount = new anchor.BN(1000000); // 0.001 SOL

    const tx = await program.methods

      .depositFee(amount)

      .accounts({

        reserve: reservePda,

        user: provider.wallet.publicKey,

        systemProgram: anchor.web3.SystemProgram.programId,

      })

      .rpc();

    const reserveAccount = await program.account.reserve.fetch(reservePda);

    expect(reserveAccount.totalDeposited.toNumber()).to.equal(amount.toNumber());

  });

});