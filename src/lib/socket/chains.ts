import * as chains from "viem/chains";

const supportedChainIds = [
  137, 1, 100, 42161, 250, 10, 43114, 56, 1313161554, 1101, 324, 7777777, 8453,
  59144, 5000, 534352, 81457, 34443, 57073, 89999, 146, 2741, 8333, 130, 80094,
];

export const supportedChains = Object.values(chains).reduce((all, chain) => {
  if (supportedChainIds.includes(chain.id)) {
    all.push(chain);
  }
  return all;
}, [] as chains.Chain[]);
