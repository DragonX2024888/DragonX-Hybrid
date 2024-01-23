# DragonX Hybrid: Deflationary NFTs

## Introduction

DragonX Hybrid introduces a significant innovation in the TitanX ecosystem, offering a unique blend of digital token trading and NFT technology. This system allows users to seamlessly convert DragonX into DragonX Hybrid NFTs using the DragonX Hybrid Bridge Contract. This fusion of traditional cryptocurrency trading with the dynamic world of NFTs aims to provide a more engaging and flexible trading experience.

## Getting Started
> This codebase uses `asdf` to manage runtime versions.

### Setting up the Environment
Copy `.env.example` and create the minimum setup to run tests.

### Installation
First, clone the repository and navigate to the project directory. Then, run the following command to install all necessary dependencies:

```bash
yarn install
```

> make sure to use `yarn` version 4.x

### Compile Contracts
Compile the smart contracts with the following command:

```bash
yarn contracts:compile
```

### Run Tests
To run the contract tests, execute:

```bash
yarn contracts:test
```

> Tests run against TitanX, DragonX and the WETH / TitanX pool, hence, make sure to provide an Ethereum mainnet-RPC.

### Linting
To check for code style and potential errors, execute the lint command:

```bash
yarn lint
```

## Frontend Development with Hardhat

### Overview
This project helps frontend developers to run a local Hardhat node with a pre-configured environment. It automatically sets up a local Ethereum blockchain with test accounts. Furthermore, it deploys DragonX Hybrid, buys some TitanX and mints DragonX with a user account for testing. Once the setup is complete, developers can use this environment for their frontend application development against a realistic Ethereum setup.

### Prerequisites

1. Ensure you have Node.js and yarn installed.
2. The necessary packages, including Hardhat, are installed.

> run `yarn install`, the repository comes with a cache
> make sure to setup the `.env` file

### Running the Script

To run the script and set up your local environment, execute:
```
yarn dev:local:run
```

This will:

1. Start a local Hardhat node.
2. Deploy the DragonX Hybrid test fixture.
3. Buy TitanX with a user account.
4. Mint DragonX
5. Output a deployment summary to the consol and a file, detailing accounts, token addresses, and other relevant details.

### Usage

With the local Hardhat node running, frontend developers can now interact with the Ethereum blockchain using the provided test accounts and the smart contracts deployed. 

- When developing your frontend, connect to the local Ethereum node at `http://localhost:8545`.
- Use the private keys from the deployment summary to add the user account to Metamask and add the DragonX / TitanX token addresses
- Interact with DragonX Hybrid as the user

### Shutting Down

To shut down the Hardhat node gracefully, simply press `Ctrl + C`.

### Notes

1. Always remember, the test accounts and the environment are for development purposes only. Do not use in production.
2. Every time you run the script, it will set up a fresh environment, so any prior transactions or changes made in the local environment will be reset.
