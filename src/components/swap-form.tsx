"use client";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { ConnectButton } from "src/components/connect-button";
import { TokenLogo } from "src/components/token-logo";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { useDebounce } from "src/hooks/use-debounce";
import {
  checkAllowance,
  getApprovalTransactionData,
  getQuote,
  getRouteTransactionData,
} from "src/lib/socket/api";
import { GetQuoteParams } from "src/lib/socket/types";
import { ethToken, usdcToken } from "src/lib/tokens";
import { useTransactionHistory } from "src/store/use-transaction-history";
import type { Address } from "viem";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useSendTransaction,
} from "wagmi";

const useQuote = (params: GetQuoteParams) => {
  return useQuery({
    queryKey: ["quote", params],
    queryFn: async () => {
      if (!params.fromAmount) return null;
      const quote = await getQuote(params);
      console.log("quote", quote.result);
      return quote;
    },
  });
};

export const SwapForm = () => {
  const chainId = useChainId();
  const fromChainId = chainId;
  const toChainId = chainId;

  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { sendTransactionAsync: sendTransaction } = useSendTransaction();

  const [amount, setAmount] = useState(0);
  const debouncedAmount = useDebounce(amount, 500);
  const [tokenFrom, setTokenFrom] = useState(ethToken);
  const [tokenTo, setTokenTo] = useState(usdcToken);

  const { data: quote } = useQuote({
    fromChainId: fromChainId,
    fromTokenAddress: tokenFrom.address,
    toChainId: toChainId,
    toTokenAddress: tokenTo.address,
    fromAmount: debouncedAmount * 10 ** tokenFrom.decimals,
    userAddress: address ?? "0x902Cb8701A268d953A5A500556Cfd1A74D40bfDD",
    uniqueRoutesPerBridge: true,
    sort: "output",
    singleTxOnly: true,
  });

  const quoteAmount = useMemo(() => {
    const toAmount = Number(quote?.result?.routes[0]?.toAmount);
    return toAmount / 10 ** tokenTo.decimals;
  }, [quote?.result?.routes[0]?.toAmount, tokenTo.decimals]);

  const addTransaction = useTransactionHistory((s) => s.addTransaction);

  const onSwap = async () => {
    if (!address || !publicClient) {
      console.info("Required data is missing", { address, publicClient });
      return;
    }

    try {
      const route = quote?.result?.routes[0];
      if (!route) throw new Error("No routes found");

      const routeData = await getRouteTransactionData({ route });
      console.log("routeData", routeData.result);

      const isNativeToken = routeData.result.approvalData === null;

      if (!isNativeToken) {
        const { allowanceTarget, minimumApprovalAmount } =
          routeData.result.approvalData;
        const allowanceStatus = await checkAllowance({
          chainID: fromChainId,
          owner: address,
          allowanceTarget,
          tokenAddress: tokenFrom.address,
        });
        console.log("allowanceStatus", allowanceStatus.result);

        const allowanceValue = Number(allowanceStatus.result?.value);
        const isSufficientAllowance =
          Number(minimumApprovalAmount) > allowanceValue;
        console.log("isSufficientAllowance", isSufficientAllowance);

        if (!isSufficientAllowance) throw new Error("Insufficient allowance");

        const approvalData = await getApprovalTransactionData({
          chainID: fromChainId,
          owner: address,
          allowanceTarget,
          tokenAddress: tokenFrom.address,
          amount,
        });
        console.log("approvalData", approvalData.result);

        const txHash = await sendTransaction({
          account: approvalData.result.from as Address,
          to: approvalData.result.to as Address,
          data: approvalData.result.data as Address,
          // value: BigInt(0),
        });
        console.log("Approval TX Hash:", txHash);
        addTransaction({ transactionHash: txHash, fromChainId, toChainId });

        return txHash;
      }

      const txHash = await sendTransaction({
        account: address,
        to: routeData.result.txTarget as Address,
        data: routeData.result.txData as Address,
        value: BigInt(routeData.result.value),
      });
      console.log("Bridging TX Hash:", txHash);
      addTransaction({ transactionHash: txHash, fromChainId, toChainId });

      return txHash;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSwap();
      }}
      className="flex w-full flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.valueAsNumber)}
            type="number"
            className="w-full"
          />
          <Button variant="secondary">
            <TokenLogo
              src={tokenFrom.logoURI}
              chainSrc="/img/chains/arb.svg"
              className="size-6"
            />
            <span>{tokenFrom.symbol}</span>
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <Button
            onClick={() => {
              const from = tokenFrom;
              const to = tokenTo;
              setTokenFrom(to);
              setTokenTo(from);
              setAmount(0);
            }}
            variant="ghost"
            size="icon"
          >
            <ArrowUpDown className="size-3 text-neutral-500" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={quoteAmount}
            type="number"
            readOnly
            className="w-full"
          />
          <Button variant="secondary">
            <TokenLogo
              src={tokenTo.logoURI}
              chainSrc="/img/chains/arb.svg"
              className="size-6"
            />
            <span>{tokenTo.symbol}</span>
          </Button>
        </div>
      </div>

      {address ? (
        <Button type="submit" disabled={!address || !quote}>
          Bridge
        </Button>
      ) : (
        <ConnectButton>Connect Wallet</ConnectButton>
      )}
    </form>
  );
};
