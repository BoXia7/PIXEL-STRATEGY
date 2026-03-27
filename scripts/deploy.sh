#!/bin/bash

# Deploy Pixel Strategy to Solana

echo "Building program..."

cd ../contracts

anchor build

echo "Deploying to devnet..."

anchor deploy --provider.cluster devnet

echo "Deployment complete. Update Anchor.toml for mainnet deployment."

# For mainnet deployment, change cluster to mainnet-beta and ensure wallet has funds