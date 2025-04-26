import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { injectedWallet, safeWallet } from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { arbitrum } from "wagmi/chains";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet, safeWallet],
    },
  ],
  {
    appName: "My dApp",
    projectId: "YOUR_PROJECT_ID",
  },
);

export const config = createConfig({
  chains: [arbitrum],
  connectors,
  ssr: true,
  transports: {
    [arbitrum.id]: http(arbitrum.rpcUrls.default.http[0]),
  },
});
