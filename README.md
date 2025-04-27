MVP that demonstrates a token swap (USDC to ETH) on Arbitrum using [Bungee API](https://docs.bungee.exchange), with focus on supporting Safe wallets and batching via EIP-5792

## Tech Stack

- React (Next.js)
- Wagmi
- rainbowkit
- TypeScript
- TailwindCSS

## Useful Links

- Integration Guide for Bungee Manual: https://docs.bungee.exchange/bungee-manual/socket-api/guides/single-tx-bridging
- Example Script: https://docs.bungee.exchange/bungee-manual/socket-api/examples/single-tx-example
- Safe: https://docs.safe.global/
- EIP-5792: https://eips.ethereum.org/EIPS/eip-5792

## TODO

- [x] Create a simple React/Next.js app with wallet connection capabilities
- [x] Support both standard EOA wallets and Safe smart wallets
- [x] Implement a single-chain swap from USDC to ETH on Arbitrum via BungeeAPIs
- [x] Hardcode token addresses and network for simplicity
- [x] Allow user to input amount to swap
- [x] Detect if connected wallet is a Safe wallet
- [x] If using Safe, implement EIP-5792 batching for token approval + swap transaction
- [x] For EOA wallets, handle approval and swap sequentially
- [ ] Show transaction status (pending, success, failed)
  - NOTE: `/v2/bridge-status` always returns `PENDING` tx status
- [x] For Safe wallets, display signature collection progress
- [x] Simple, clean UI focused on functionality
- [ ] Provide clear instructions for setup and testing
- [ ] Document key implementation decisions
