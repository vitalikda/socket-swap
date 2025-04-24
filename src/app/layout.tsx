import "./globals.css";

import { EvmProvider } from "../providers/evm-provider";
import { QueryProvider } from "../providers/query-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <EvmProvider>
            {/*  */}
            {children}
          </EvmProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
