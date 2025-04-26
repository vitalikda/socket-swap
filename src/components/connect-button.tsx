"use client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button, type ButtonProps } from "src/components/ui/button";

export const ConnectButton = (props: Omit<ButtonProps, "onClick">) => {
  const { openConnectModal } = useConnectModal();

  return <Button {...props} onClick={openConnectModal} />;
};
