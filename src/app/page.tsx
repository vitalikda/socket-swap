import { AccountMenu } from "src/components/account-menu";
import { SwapForm } from "src/components/swap-form";
import { TransactionHistory } from "src/components/transaction-history";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center p-6">
      <AccountMenu />
      <br />
      <SwapForm />
      <br />
      <TransactionHistory />
    </main>
  );
}
