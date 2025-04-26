import { AccountMenu } from "src/components/account-menu";
import { SwapForm } from "src/components/swap-form";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full max-w-md mx-auto p-6">
      <AccountMenu />
      <br />
      <SwapForm />
    </main>
  );
}
