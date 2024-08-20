"use client";

// @refresh reset
import React, { useState, useEffect } from 'react';
import type { Address } from "viem";
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { useNetworkColor, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";
import type { ConnectButtonProps } from '@rainbow-me/rainbowkit';

// Type definitions for RainbowKit and Wagmi
import type { Chain as ViemChain, Address } from 'viem';
import type { ConnectButtonProps as RainbowKitConnectButtonProps } from '@rainbow-me/rainbowkit';

type Chain = ViemChain & {
  unsupported?: boolean;
};

type ConnectButtonProps = RainbowKitConnectButtonProps & {
  mounted: boolean;
};

type RainbowKitConnectButton = React.ComponentType<{
  children: (props: ConnectButtonProps) => React.ReactNode;
}>;

type UseAccountReturnType = {
  address?: Address;
  isConnecting: boolean;
  isDisconnected: boolean;
};

type UseNetworkReturnType = {
  chain?: Chain;
  chains: Chain[];
};

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = (): JSX.Element => {
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();
  const [ConnectButton, setConnectButton] = useState<RainbowKitConnectButton | null>(null);
  const [wagmiHooks, setWagmiHooks] = useState<{
    useAccount: () => UseAccountReturnType;
    useNetwork: () => UseNetworkReturnType;
  } | null>(null);

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [rainbowKit, wagmi] = await Promise.all([
          import('@rainbow-me/rainbowkit'),
          import('wagmi')
        ]);

        if (typeof rainbowKit.ConnectButton !== 'function') {
          throw new Error('ConnectButton not found in @rainbow-me/rainbowkit');
        }

        if (typeof wagmi.useAccount !== 'function' || typeof wagmi.useNetwork !== 'function') {
          throw new Error('Required hooks not found in wagmi');
        }

        setConnectButton(() => rainbowKit.ConnectButton);
        setWagmiHooks({ useAccount: wagmi.useAccount, useNetwork: wagmi.useNetwork });
      } catch (error) {
        console.error('Failed to load dependencies:', error instanceof Error ? error.message : String(error));
        // You might want to set an error state here to display to the user
      }
    };
    void loadDependencies();
  }, []);

  if (!ConnectButton || !wagmiHooks) {
    return <div>Loading...</div>;
  }

  const { useAccount, useNetwork } = wagmiHooks;

  return (
    <ConnectButton>
      {({ account, chain, openConnectModal, mounted }: ConnectButtonProps): JSX.Element => {
        const { address } = useAccount();
        const { chain: connectedChain } = useNetwork();
        const connected = mounted && address && connectedChain;
        const blockExplorerAddressLink = address && targetNetwork
          ? getBlockExplorerAddressLink(targetNetwork, address)
          : undefined;

        return (
          <>
            {((): JSX.Element => {
              if (!connected) {
                return (
                  <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }

              if (connectedChain?.unsupported || (connectedChain?.id !== undefined && targetNetwork?.id !== undefined && connectedChain.id !== targetNetwork.id)) {
                return <WrongNetworkDropdown />;
              }

              return (
                <>
                  <div className="flex flex-col items-center mr-1">
                    <Balance address={address} className="min-h-0 h-auto" />
                    {connectedChain && (
                      <span className="text-xs" style={{ color: networkColor(connectedChain) }}>
                        {connectedChain.name}
                      </span>
                    )}
                  </div>
                  <AddressInfoDropdown
                    address={address}
                    displayName={account?.displayName ?? ''}
                    ensAvatar={account?.ensAvatar}
                    blockExplorerAddressLink={blockExplorerAddressLink}
                  />
                  <AddressQRCodeModal address={address} modalId="qrcode-modal" />
                </>
              );
            })()}
          </>
        );
      }}
    </ConnectButton>
  );
};
