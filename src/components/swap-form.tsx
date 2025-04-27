"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowUpDown, LoaderCircle } from "lucide-react";
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
import type {
  GetQuoteParams,
  GetRouteTransactionDataParams,
} from "src/lib/socket/types";
import { ethToken, usdcToken } from "src/lib/tokens";
import { useTransactionHistory } from "src/store/use-transaction-history";
import type { Address } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { arbitrum } from "viem/chains";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

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

const useSwap = () => {
  const publicClient = usePublicClient({ chainId: arbitrum.id });
  const { data: walletClient } = useWalletClient();
  const { connector } = useAccount();
  const isSafe = useMemo(() => connector?.id === "safe", [connector?.id]);

  const addTransaction = useTransactionHistory((s) => s.addTransaction);

  return useMutation({
    mutationFn: async ({
      route,
      fromChainId,
      toChainId,
      tokenAddress,
      amount,
    }: {
      route: GetRouteTransactionDataParams["route"];
      fromChainId: number;
      toChainId: number;
      tokenAddress: string;
      amount: number;
    }) => {
      if (!publicClient || !walletClient) {
        console.info("Required data is missing", {
          publicClient,
          walletClient,
        });
        return;
      }

      const { result: routeTxData } = await getRouteTransactionData({ route });
      console.log("routeData", routeTxData);

      const transactions = [
        {
          to: routeTxData.txTarget as Address,
          data: routeTxData.txData as Address,
          value: BigInt(routeTxData.value),
        },
      ];

      const isNativeToken = routeTxData.approvalData === null;

      if (!isNativeToken) {
        const { allowanceTarget, minimumApprovalAmount } =
          routeTxData.approvalData;
        const { result: allowanceStatus } = await checkAllowance({
          chainID: fromChainId,
          owner: walletClient.account.address,
          allowanceTarget,
          tokenAddress,
        });
        console.log("allowanceStatus", allowanceStatus);

        const allowanceValue = Number(allowanceStatus.value);
        const isSufficientAllowance =
          Number(minimumApprovalAmount) > allowanceValue;
        console.log("isSufficientAllowance", isSufficientAllowance);

        if (isSufficientAllowance) {
          const { result: approvalData } = await getApprovalTransactionData({
            chainID: fromChainId,
            owner: walletClient.account.address,
            allowanceTarget,
            tokenAddress,
            amount,
          });
          console.log("approvalData", approvalData);

          transactions.unshift({
            to: approvalData.to as Address,
            data: approvalData.data as Address,
            value: BigInt(0),
          });
        }
      }

      if (isSafe) {
        const { id: txHash } = await walletClient.sendCalls({
          account: walletClient.account,
          calls: transactions,
        });
        console.log("Batch Bridging TX:", txHash);
        addTransaction({ transactionHash: txHash, fromChainId, toChainId });

        return txHash;
      }

      let txHash = "";

      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];
        const sentTx = await walletClient.sendTransaction({
          account: walletClient.account,
          to: tx.to,
          data: tx.data,
          value: tx.value,
        });
        console.log(`Bridging TX #${i + 1}:`, sentTx);

        if (i < transactions.length - 1) {
          await waitForTransactionReceipt(publicClient, { hash: sentTx });
          continue;
        }

        txHash = sentTx;
      }

      if (txHash) {
        addTransaction({ transactionHash: txHash, fromChainId, toChainId });
      }

      return txHash;
    },
    onSuccess: (data, params) => {
      console.log("SWAP:SUCCESS", data, params);
    },
    onError: (error, params) => {
      console.log("SWAP:ERROR", error, params);
    },
  });
};

export const SwapForm = () => {
  const { address, connector } = useAccount();
  const isSafe = useMemo(() => connector?.id === "safe", [connector?.id]);

  const [fromChainId, _setFromChainId] = useState(arbitrum.id);
  const [toChainId, _setToChainId] = useState(arbitrum.id);

  const [tokenFrom, setTokenFrom] = useState(ethToken);
  const [tokenTo, setTokenTo] = useState(usdcToken);

  const [amount, setAmount] = useState("");
  const amountDebounced = useDebounce(Number(amount), 500);

  const { data: quote } = useQuote({
    fromChainId: fromChainId,
    fromTokenAddress: tokenFrom.address,
    toChainId: toChainId,
    toTokenAddress: tokenTo.address,
    fromAmount: amountDebounced * 10 ** tokenFrom.decimals,
    userAddress: address ?? "0x902Cb8701A268d953A5A500556Cfd1A74D40bfDD", // note: fallback to random address for public access
    uniqueRoutesPerBridge: true,
    sort: "output",
    singleTxOnly: true,
  });

  const amountQuote = useMemo(() => {
    const toAmount = Number(quote?.result?.routes[0]?.toAmount || 0);
    return toAmount / 10 ** tokenTo.decimals;
  }, [quote?.result?.routes[0]?.toAmount, tokenTo.decimals]);

  const { mutate: onSwap, isPending: isSwapping, error: swapError } = useSwap();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <Input
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
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
              setAmount("");
            }}
            variant="ghost"
            size="icon"
          >
            <ArrowUpDown className="size-3 text-neutral-500" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={amountQuote ? amountQuote.toString() : ""}
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

      {!address ? (
        <ConnectButton>Connect Wallet</ConnectButton>
      ) : !amount ? (
        <Button disabled>Enter Amount</Button>
      ) : !!quote && !quote.result?.routes[0] ? (
        <Button disabled>No swap routes found</Button>
      ) : (
        <Button
          onClick={() => {
            if (!quote) return;
            onSwap({
              route: quote.result.routes[0],
              fromChainId,
              toChainId,
              tokenAddress: tokenFrom.address,
              amount: Number(amount) * 10 ** tokenFrom.decimals,
            });
          }}
          disabled={!quote || isSwapping}
        >
          {isSwapping && <LoaderCircle className="size-4 animate-spin" />}
          {isSafe && "Propose "}
          Bridge
        </Button>
      )}

      {!!swapError && (
        <p className="truncate text-sm text-red-500">
          {swapError.message.slice(0, 100)}
        </p>
      )}
    </div>
  );
};
