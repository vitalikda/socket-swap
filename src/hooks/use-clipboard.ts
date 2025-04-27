import { useCallback, useState } from "react";
import { copyToClipboard } from "src/lib/clipboard";

export const useClipboard = (delay = 1000) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    const res = await copyToClipboard(text);
    if (!res) return;
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, delay);
  }, []);

  return { copied, copy };
};
