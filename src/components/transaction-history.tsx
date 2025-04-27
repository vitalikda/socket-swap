"use client";
import SafeApiKit from "@safe-global/api-kit";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  Check,
  Copy,
  LoaderCircle,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Button } from "src/components/ui/button";
import { useClipboard } from "src/hooks/use-clipboard";
import { getBridgeStatus } from "src/lib/socket/api";
import { shortenAddress } from "src/lib/strings";
import {
  useTransactionHistory,
  type Transaction,
} from "src/store/use-transaction-history";

// NOTE: `getBridgeStatus` always returns `PENDING` status
const useSocketTransactionStatus = ({
  isComplete,
  isSafe,
  ...props
}: Transaction) => {
  const markTransactionComplete = useTransactionHistory(
    (s) => s.markTransactionComplete,
  );

  return useQuery({
    enabled: !isComplete && !isSafe,
    queryKey: ["transaction", "status", props],
    queryFn: async () => {
      const { result: status } = await getBridgeStatus(props);
      console.log("status", status);
      if (status.destinationTxStatus !== "COMPLETED") {
        throw new Error("Transaction not completed");
      }
      markTransactionComplete(props);
      return status;
    },
    retry: true,
    retryDelay: 20_000,
  });
};

const useSafeTransactionStatus = ({
  isComplete,
  isSafe,
  ...props
}: Transaction) => {
  const markTransactionComplete = useTransactionHistory(
    (s) => s.markTransactionComplete,
  );

  return useQuery({
    enabled: !isComplete && !!isSafe,
    queryKey: ["transaction", "status", "safe", props],
    queryFn: async () => {
      const apiKit = new SafeApiKit({
        chainId: BigInt(props.fromChainId),
      });
      const signedTransaction = await apiKit.getTransaction(
        props.transactionHash,
      );
      console.log("signedTransaction", signedTransaction);
      if (signedTransaction.isExecuted) {
        markTransactionComplete(props);
      }
      return signedTransaction;
    },
    refetchInterval: 20_000,
  });
};

const TransactionItem = (props: Transaction) => {
  const { copied, copy } = useClipboard();
  // useSocketTransactionStatus(props);
  const { data: signedTransaction } = useSafeTransactionStatus(props);

  return (
    <div className="flex w-full items-center gap-2 py-1 text-sm">
      {/* {!props.isComplete ? ( */}
      {!props.isComplete && props.isSafe ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <BadgeCheck className="size-4 text-green-500" />
      )}
      <span>{shortenAddress({ address: props.transactionHash })}</span>
      <button
        onClick={() => copy(props.transactionHash)}
        className="size-fit cursor-pointer"
      >
        {copied ? (
          <Check className="size-3 text-green-500" />
        ) : (
          <Copy className="size-3" />
        )}
      </button>
      {!!props.isSafe && !!signedTransaction && (
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
          {signedTransaction.confirmations?.length ?? 0} of
          {signedTransaction.confirmationsRequired} sigs
        </span>
      )}
      <Button variant="ghost" className="ml-auto" asChild>
        <a
          href={`https://arbiscan.io/tx/${props.transactionHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <SquareArrowOutUpRight className="size-3" />
        </a>
      </Button>
    </div>
  );
};

export const TransactionHistory = () => {
  const transactions = useTransactionHistory((s) => s.transactions);

  if (!transactions.length) return null;

  return (
    <div className="flex w-full flex-col divide-y divide-neutral-200">
      {transactions.map((tx) => (
        <TransactionItem key={tx.transactionHash} {...tx} />
      ))}
    </div>
  );
};
