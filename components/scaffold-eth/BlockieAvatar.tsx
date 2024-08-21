"use client";

import React from 'react';
import PropTypes from 'prop-types';
import { blo } from "blo";
import type { AvatarComponent } from "@rainbow-me/rainbowkit";

export const BlockieAvatar: AvatarComponent = ({ address, ensImage, size }: { address: `0x${string}`; ensImage?: string; size: number }) => {
  return (
    // Don't want to use nextJS Image here (and adding remote patterns for the URL)
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-full"
      src={ensImage || (address ? blo(address) : '')}
      width={size}
      height={size}
      alt={`${address} avatar`}
    />
  );
};

BlockieAvatar.propTypes = {
  address: PropTypes.string.isRequired,
  ensImage: PropTypes.string,
  size: PropTypes.number.isRequired,
};
