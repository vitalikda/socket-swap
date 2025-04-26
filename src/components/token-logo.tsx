"use client";
import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { cn } from "src/lib/css";

type Props = {
  fallbackSrc?: string;
  chainSrc?: string;
} & Pick<ImageProps, "src" | "className">;

const fallbackImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export const TokenLogo = ({
  src: tokenSrc,
  fallbackSrc = fallbackImage,
  chainSrc,
  className,
}: Props) => {
  const [src, setSrc] = useState<ImageProps["src"]>("");

  useEffect(() => {
    setSrc(tokenSrc || "");
  }, [tokenSrc]);

  return (
    <span className="relative w-fit min-w-fit">
      <Image
        src={src || fallbackSrc}
        alt=""
        width={16}
        height={16}
        onError={() => setSrc(fallbackSrc)}
        quality={100}
        loading="lazy"
        className={cn("rounded-full object-cover", className)}
      />
      {!!chainSrc && (
        <Image
          src={chainSrc}
          alt=""
          width={8}
          height={8}
          className="absolute right-0 bottom-0 h-1/2 min-h-2 w-1/2 min-w-2 rounded-full object-cover"
        />
      )}
    </span>
  );
};
