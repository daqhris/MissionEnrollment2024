"use client";

import React from 'react';
import { blo } from "blo";
import type { AvatarComponent } from "@rainbow-me/rainbowkit";

export const BlockieAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  const validAddress = typeof address === 'string' && address.startsWith('0x') ? address as `0x${string}` : undefined;
  const imageSize = typeof size === 'number' ? size : 24; // Default size if not provided

  return (
    // Don't want to use nextJS Image here (and adding remote patterns for the URL)
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-full"
      src={ensImage || (validAddress ? blo(validAddress) : '')}
      width={imageSize}
      height={imageSize}
      alt={`${validAddress || 'Unknown'} avatar`}
    />
  );
};
