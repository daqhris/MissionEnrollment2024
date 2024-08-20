import React, { useState, useEffect } from 'react';
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";
import type { ChainWithAttributes } from "~~/utils/scaffold-eth/networks";
import type { Chain } from 'viem';
import type { UseNetworkResult, UseSwitchNetworkResult } from 'wagmi';

const allowedNetworks: ChainWithAttributes[] = getTargetNetworks();

type NetworkOptionsProps = {
  hidden?: boolean;
};

export const NetworkOptions: React.FC<NetworkOptionsProps> = ({ hidden = false }): JSX.Element => {
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const networkColor = useNetworkColor();
  const [wagmiHooks, setWagmiHooks] = useState<{
    useNetwork: () => { chain: Chain | undefined };
    useSwitchNetwork: () => {
      switchNetwork: ((chainId: number) => Promise<Chain>) | undefined;
      error: Error | null;
      isLoading: boolean;
    };
  } | null>(null);

  useEffect(() => {
    const loadWagmiHooks = async () => {
      try {
        const wagmi = await import('wagmi');
        if (typeof wagmi.useNetwork !== 'function' || typeof wagmi.useSwitchNetwork !== 'function') {
          throw new Error('Required wagmi hooks not found');
        }
        setWagmiHooks({
          useNetwork: wagmi.useNetwork,
          useSwitchNetwork: wagmi.useSwitchNetwork
        });
      } catch (error) {
        console.error('Failed to load wagmi hooks:', error instanceof Error ? error.message : String(error));
        setSwitchError('Failed to load network switching functionality. Please try again.');
      }
    };
    void loadWagmiHooks();
  }, []);

  useEffect(() => {
    if (wagmiHooks) {
      const { chain } = wagmiHooks.useNetwork();
      setCurrentChainId(chain?.id ?? null);
    }
  }, [wagmiHooks]);

  const handleNetworkSwitch = async (networkId: number): Promise<void> => {
    if (!wagmiHooks) return;
    const { switchNetwork } = wagmiHooks.useSwitchNetwork();
    if (!switchNetwork) {
      setSwitchError('Network switching is not available.');
      return;
    }
    setIsLoading(true);
    setSwitchError(null);
    try {
      await switchNetwork(networkId);
    } catch (error: unknown) {
      console.error('Failed to switch network:', error instanceof Error ? error.message : String(error));
      setSwitchError('Failed to switch network. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!wagmiHooks || currentChainId === null) {
    return <div>Loading network options...</div>;
  }

  return (
    <>
      {allowedNetworks
        .filter((allowedNetwork) => allowedNetwork.id !== currentChainId)
        .map((allowedNetwork) => (
          <li key={allowedNetwork.id} className={hidden ? "hidden" : ""}>
            <button
              className="menu-item btn-sm !rounded-xl flex gap-3 py-3 whitespace-nowrap"
              type="button"
              onClick={(): Promise<void> => handleNetworkSwitch(allowedNetwork.id)}
              disabled={isLoading}
            >
              <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />
              <span>
                {isLoading ? "Switching..." : `Switch to `}
                <span
                  style={{
                    color: networkColor(allowedNetwork),
                  }}
                >
                  {allowedNetwork.name}
                </span>
              </span>
            </button>
          </li>
        ))}
      {switchError && <li className="text-red-500 px-4 py-2">{switchError}</li>}
    </>
  );
};
