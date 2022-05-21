# AEOLUS PROTOCOL

https://user-images.githubusercontent.com/57980116/169635884-5f0b732d-a0a5-4c4d-9cf2-c586af0c4abf.mp4

## Summary

Aeolus Protocol is a passive cryptocurrency fund operating on Avalanche Blockchain that earns additional yield on top of capital gains by providing the underlying assets to the liquidity pool. It is developed as a part of 2143499 ICE PROJECT. 

After users chose and invest in AeolusPair with USDT.e, AeolusRouter contract will then swap the supplied USDT.e into the designated token of the AeolusPair through DEX contract. Then, the those tokens will be paired, and provided in a liquidity pool on the DEX. Once the process is done, the AeolusPair LP token will be minted to the investor to represent the ownership of money in AeolusPair.

The dAPP can be visited at https://aeolus-dapp.vercel.app/. The smart contracts are deployed on Avalanche C-Chain Mainnet at the address 0xfac701de57226b83325abe2f0d8f053c8759dc46 for AeolusFactory contract and at 0xB2412D9eCc65D5919B681Bca3f25Fb1B2fE5a391 for AeolusRouter.


## Architecture

<img width="696" alt="image21" src="https://user-images.githubusercontent.com/57980116/169636056-357dce92-a267-4dd1-8537-f2f0fdb56744.png">

The three main parts of this dAPP are smart contracts, frontend, and backend. The smart contracts are the execution part of this protocol. The frontend allows users to interact with the protocol through the web interface. The backend acts as the database for tracking users’ transactions.

<img width="571" alt="image24" src="https://user-images.githubusercontent.com/57980116/169636059-8c199f2b-87c1-4ccc-929f-e5c43d9aedd5.png">

Smart contracts are separated into two main parts, the core contracts which include AeolusFactory and AeolusPair contracts, they are the central logic of Aeolus Protocol, and the periphery contract which includes AeolusRouter contract, it is the contract that communicates with users and other decentralized exchange’s contracts.

## Development

This repository contains two main parts, the frontend directory and the smart contract directory.

Frontend is written using Next.js and Typescript with twin as the styling tool. The website is deployed using Vercel and can be visited at https://aeolus-dapp.vercel.app/, the current version is not responsive and only optimized for MacBook Pro 14-inch, 2021.

The smart contracts are written using solidity and were deployed to the Avalanche C-Chain Mainnet at the address 0xfac701de57226b83325abe2f0d8f053c8759dc46 for AeolusFactory contract and at 0xB2412D9eCc65D5919B681Bca3f25Fb1B2fE5a391 for AeolusRouter.




