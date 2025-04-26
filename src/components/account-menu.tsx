"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export const AccountMenu = () => {
  const { isConnected } = useAccount();
  if (!isConnected) return null;
  return <ConnectButton />;
};
