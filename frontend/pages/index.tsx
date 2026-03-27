import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { PublicKey } from '@solana/web3.js';

import { useEffect, useState } from 'react';

const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

export default function Home() {

  const { connection } = useConnection();

  const { publicKey } = useWallet();

  const [reserveBalance, setReserveBalance] = useState<number>(0);

  const [totalDeposited, setTotalDeposited] = useState<number>(0);

  useEffect(() => {

    if (publicKey) {

      const [reservePda] = PublicKey.findProgramAddressSync(

        [Buffer.from('reserve')],

        PROGRAM_ID

      );

      connection.getBalance(reservePda).then(setReserveBalance);

      // For totalDeposited, would need to fetch account data, but for simplicity, show balance

      setTotalDeposited(reserveBalance / 1e9); // Convert lamports to SOL

    }

  }, [connection, publicKey, reserveBalance]);

  return (

    <div style={{ padding: '20px' }}>

      <h1>Pixel Strategy Dashboard</h1>

      <WalletMultiButton />

      {publicKey && (

        <div>

          <h2>Reserve Information</h2>

          <p>Reserve Balance: {reserveBalance / 1e9} SOL</p>

          <p>Total Deposited: {totalDeposited} SOL</p>

        </div>

      )}

    </div>

  );

}