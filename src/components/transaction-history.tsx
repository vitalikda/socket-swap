"use client";
import { useQuery } from "@tanstack/react-query";
import { Copy, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "src/components/ui/button";
import { copyToClipboard } from "src/lib/clipboard";
import { getBridgeStatus } from "src/lib/socket/api";
import { shortenAddress } from "src/lib/strings";
import {
  useTransactionHistory,
  type Transaction,
} from "src/store/use-transaction-history";

// NOTE: `getBridgeStatus` always returns `PENDING` status
const useCheckTransactionStatus = ({ isComplete, ...props }: Transaction) => {
  const markTransactionComplete = useTransactionHistory(
    (s) => s.markTransactionComplete,
  );

  return useQuery({
    enabled: !isComplete,
    queryKey: ["transaction", "status", props],
    queryFn: async () => {
      const status = await getBridgeStatus(props);
      console.log("status", status.result);
      if (status.result.destinationTxStatus !== "COMPLETED") {
        throw new Error("Transaction not completed");
      }
      markTransactionComplete(props);
      return status;
    },
    retry: true,
    retryDelay: 20_000,
  });
};

const TransactionItem = ({ isComplete, ...props }: Transaction) => {
  // useCheckTransactionStatus({ isComplete, ...props });

  return (
    <div className="flex w-full items-center gap-2 py-1 text-sm">
      {/* {!isComplete && <LoaderCircle className="size-4 animate-spin" />}
      {isComplete && <BadgeCheck className="size-4 text-green-500" />} */}
      <span>{shortenAddress({ address: props.transactionHash })} </span>
      <button
        onClick={() => copyToClipboard(props.transactionHash)}
        className="size-fit cursor-pointer"
      >
        <Copy className="size-3" />
      </button>
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
