use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]

pub mod pixel_strategy {

    use super::*;

    pub fn initialize_reserve(ctx: Context<InitializeReserve>) -> Result<()> {

        let reserve = &mut ctx.accounts.reserve;

        reserve.authority = ctx.accounts.authority.key();

        reserve.total_deposited = 0;

        Ok(())

    }

    pub fn deposit_fee(ctx: Context<DepositFee>, amount: u64) -> Result<()> {

        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(

            &ctx.accounts.user.key(),

            &ctx.accounts.reserve.key(),

            amount,

        );

        anchor_lang::solana_program::program::invoke(

            &transfer_ix,

            &[

                ctx.accounts.user.to_account_info(),

                ctx.accounts.reserve.to_account_info(),

            ],

        )?;

        let reserve = &mut ctx.accounts.reserve;

        reserve.total_deposited += amount;

        Ok(())

    }

}

#[derive(Accounts)]

pub struct InitializeReserve<'info> {

    #[account(

        init,

        payer = authority,

        space = 8 + 32 + 8,

        seeds = [b"reserve"],

        bump

    )]

    pub reserve: Account<'info, Reserve>,

    #[account(mut)]

    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]

pub struct DepositFee<'info> {

    #[account(

        mut,

        seeds = [b"reserve"],

        bump

    )]

    pub reserve: Account<'info, Reserve>,

    #[account(mut)]

    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,

}

#[account]

pub struct Reserve {

    pub authority: Pubkey,

    pub total_deposited: u64,

}