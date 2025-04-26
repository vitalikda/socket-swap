import type { GetBridgeStatusParams } from "src/lib/socket/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Transaction = {
  isComplete?: boolean;
} & GetBridgeStatusParams;

export const useTransactionHistory = create<{
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  markTransactionComplete: (tx: Transaction) => void;
}>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),
      markTransactionComplete: (tx) =>
        set((state) => {
          const index = state.transactions.findIndex(
            (t) => t.transactionHash === tx.transactionHash,
          );
          if (index === -1) return state;
          const transactions = [...state.transactions];
          transactions[index] = {
            ...transactions[index],
            isComplete: true,
          };
          return { transactions };
        }),
    }),
    { name: "transaction-history" },
  ),
);
