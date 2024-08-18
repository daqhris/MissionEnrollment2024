"use client";

import { AvatarComponent } from "@rainbow-me/rainbowkit";
import { blo } from "blo";
import { Address } from "viem";

interface BlockieAvatarProps {
  address: Address;
  ensImage?: string | null;
  size: number;
}

// Custom Avatar for RainbowKit
export const BlockieAvatar: AvatarComponent = ({ address, ensImage, size }: BlockieAvatarProps) => {
  return (
    // Don't want to use nextJS Image here (and adding remote patterns for the URL)
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-full"
      src={ensImage || blo(address as `0x${string}`)}
      width={size}
      height={size}
      alt={`${address} avatar`}
    />
  );
};
