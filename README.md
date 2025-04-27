MVP that demonstrates a token swap (USDC to ETH) on Arbitrum using [Bungee API](https://docs.bungee.exchange), with focus on supporting Safe wallets and batching via EIP-5792

## Tech Stack

- React (Next.js)
- Wagmi
- rainbowkit
- TypeScript
- TailwindCSS

### Local Development

```bash
git clone https://github.com/vitalikda/socket-swap.git
cd socket-swap
pnpm install
pnpm run dev
```

### Safe Wallet Integration

1. Open the Safe app: https://app.safe.global/
2. Open the "Apps" tab
3. Click on the "Add My Custom App" button
4. Paste the project's URL: `http://localhost:3000` or Vercel URL

Step-by-step Guide: https://help.safe.global/en/articles/40859-add-a-custom-safe-app

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
- [x] Provide clear instructions for setup and testing
- [ ] Document key implementation decisions
