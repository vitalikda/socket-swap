import type { Address } from "viem";

type Token = {
  address: Address;
  symbol: string;
  decimals: number;
  logoURI: string;
  isNative?: boolean;
};

export const ethToken: Token = {
  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  decimals: 18,
  symbol: "ETH",
  logoURI: "/img/tokens/eth.svg",
  isNative: true,
};

export const usdcToken: Token = {
  address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
  decimals: 6,
  symbol: "USDC",
  logoURI: "/img/tokens/usdc.svg",
};
