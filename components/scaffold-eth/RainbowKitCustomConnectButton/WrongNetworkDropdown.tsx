import React, { useState, useEffect } from 'react';
import { ArrowLeftOnRectangleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { NetworkOptions } from "./NetworkOptions";
import type { Chain } from 'viem';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string>;
    };
  }
}

export const WrongNetworkDropdown: React.FC = (): JSX.Element => {
  const [chain, setChain] = useState<Chain | undefined>(undefined);
  const [chains, setChains] = useState<Chain[]>([]);
  const [disconnect, setDisconnect] = useState<(() => void) | undefined>(undefined);
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadWagmiHooks = async () => {
      try {
        const { useNetwork, useDisconnect } = await import('wagmi');
        const { chain, chains } = useNetwork();
        setChain(chain);
        setChains(chains);
        setDisconnect(() => useDisconnect().disconnect);
      } catch (error) {
        console.error('Failed to load wagmi hooks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    void loadWagmiHooks();
  }, []);

  useEffect(() => {
    const checkNetwork = async (): Promise<void> => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setIsWrongNetwork(!chains.some((c: Chain) => c.id === parseInt(chainId, 16)));
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
  }, [chains]);

  const handleDisconnect = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    disconnect();
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
