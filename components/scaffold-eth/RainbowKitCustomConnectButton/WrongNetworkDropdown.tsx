import React, { useState, useEffect } from 'react';
import { ArrowLeftOnRectangleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { NetworkOptions } from "./NetworkOptions";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

// Remove global declaration to avoid conflicts with existing types

export const WrongNetworkDropdown: React.FC = (): JSX.Element => {
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkNetwork = async (): Promise<void> => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const currentChainId = parseInt(chainId, 16);
          const targetNetworks = getTargetNetworks();
          setIsWrongNetwork(!targetNetworks.some((network) => network.id === currentChainId));
        } else {
          setIsWrongNetwork(false);
        }
      } catch (error) {
        console.error('Failed to check network:', error);
        setIsWrongNetwork(false);
      } finally {
        setIsLoading(false);
      }
    };

    void checkNetwork();
  }, []);

  const handleDisconnect = async (): Promise<void> => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        console.log('Wallet disconnected');
      } else {
        throw new Error('No Ethereum provider detected');
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  if (isLoading) {
    return <div>Checking network...</div>;
  }

  if (!isWrongNetwork) {
    return <></>;
  }

  return (
    <div className="dropdown dropdown-end mr-2">
      <label tabIndex={0} className="btn btn-error btn-sm dropdown-toggle gap-1">
        <span>Wrong network</span>
        <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 mt-1 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
      >
        <NetworkOptions />
        <li>
          <button
            className="menu-item text-error btn-sm !rounded-xl flex gap-3 py-3"
            type="button"
            onClick={handleDisconnect}
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-4 ml-2 sm:ml-0" />
            <span>Disconnect</span>
          </button>
        </li>
      </ul>
    </div>
  );
};
