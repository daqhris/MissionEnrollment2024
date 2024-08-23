"use client";

// @refresh reset
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { useNetworkColor, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

/**
 * Custom Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = (): JSX.Element => {
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();
  const { address, isDisconnected } = useAccount();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal }): JSX.Element => {
        if (!address || isDisconnected) {
          return (
            <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
              Connect Wallet
            </button>
          );
        }

        if (chain?.id !== undefined && targetNetwork?.id !== undefined && chain.id !== targetNetwork.id) {
          return <WrongNetworkDropdown />;
        }

        const blockExplorerAddressLink = targetNetwork && address
          ? getBlockExplorerAddressLink(targetNetwork, address)
          : undefined;

        return (
          <>
            <div className="flex flex-col items-center mr-1">
              <Balance address={address} className="min-h-0 h-auto" />
              {chain && (
                <span className="text-xs" style={{ color: networkColor() }}>
                  {chain.name}
                </span>
              )}
            </div>
            <AddressInfoDropdown
              address={address}
              displayName={account?.displayName ?? ''}
              ensAvatar={account?.ensAvatar ?? ''}
              blockExplorerAddressLink={blockExplorerAddressLink ?? ''}
            />
            <AddressQRCodeModal address={address} modalId="qrcode-modal" />
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
