import React, { useState } from 'react';
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";
import type { ChainWithAttributes } from "~~/utils/scaffold-eth/networks";

const allowedNetworks: ChainWithAttributes[] = getTargetNetworks();

type NetworkOptionsProps = {
  hidden?: boolean;
};

export const NetworkOptions: React.FC<NetworkOptionsProps> = ({ hidden = false }): JSX.Element => {
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [currentChain, setCurrentChain] = useState<ChainWithAttributes | null>(null);
  const [isSwitchNetworkLoading, setIsSwitchNetworkLoading] = useState<boolean>(false);
  const networkColor = useNetworkColor();

  const handleNetworkSwitch = async (chainId: number): Promise<void> => {
    setSwitchError(null);
    setIsSwitchNetworkLoading(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        const newChain = allowedNetworks.find(network => network.id === chainId);
        setCurrentChain(newChain || null);
      } else {
        throw new Error('No Ethereum provider detected');
      }
    } catch (error: unknown) {
      console.error('Failed to switch network:', error instanceof Error ? error.message : String(error));
      setSwitchError('Failed to switch network. Please try again.');
    } finally {
      setIsSwitchNetworkLoading(false);
    }
  };

  return (
    <>
      {allowedNetworks
        .filter((allowedNetwork) => allowedNetwork.id !== currentChain?.id)
        .map((allowedNetwork) => (
          <li key={allowedNetwork.id} className={hidden ? "hidden" : ""}>
            <button
              className="menu-item btn-sm !rounded-xl flex gap-3 py-3 whitespace-nowrap"
              type="button"
              onClick={(): Promise<void> => handleNetworkSwitch(allowedNetwork.id)}
              disabled={isSwitchNetworkLoading}
            >
              <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />
              <span>
                {isSwitchNetworkLoading ? "Switching..." : `Switch to `}
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
