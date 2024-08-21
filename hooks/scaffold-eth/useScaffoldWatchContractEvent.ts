import { useEffect, useCallback } from 'react';
import { useTargetNetwork } from "./useTargetNetwork";
import type { Abi, Log } from "viem";
import { addIndexedArgsToEvent, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import type { ContractName, UseScaffoldEventConfig } from "~~/utils/scaffold-eth/contract";
import { watchContractEvent } from 'viem/actions';

// TODO: Import POAP API client and necessary types
// import { POAPClient } from '@poap/poap-eth-sdk';

/**
 * Wrapper around wagmi's useContractEvent hook which automatically loads (by name) the contract ABI and
 * address from the contracts present in deployedContracts.ts & externalContracts.ts
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.eventName - name of the event to listen for
 * @param config.listener - the callback that receives events.
 */
export const useScaffoldWatchContractEvent = <
  TContractName extends ContractName,
  TEventName extends string
>({
  contractName,
  eventName,
  listener,
}: UseScaffoldEventConfig<TContractName, TEventName>): void => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();

  const addIndexedArgsToLogs = useCallback((logs: Log[]): Log[] => logs.map(addIndexedArgsToEvent), []);
  const listenerWithIndexedArgs = useCallback((logs: Log[]): void => {
    listener(addIndexedArgsToLogs(logs) as Parameters<typeof listener>[0]);
  }, [listener, addIndexedArgsToLogs]);

  // TODO: Integrate POAP protocol
  // - Check if the event is related to POAP (e.g., POAP minting or transfer)
  // - If it's a POAP event, fetch additional data from POAP API
  // - Combine POAP data with blockchain event data

  useEffect(() => {
    if (!deployedContractData?.address || !deployedContractData?.abi) {
      return;
    }

    const provider = new ethers.providers.JsonRpcProvider(targetNetwork.rpcUrl);
    const contract = new ethers.Contract(deployedContractData.address, deployedContractData.abi, provider);

    const filter = contract.filters[eventName]();
    const listener = (...args: any[]) => {
      const event = args[args.length - 1];
      const logsWithIndexedArgs = addIndexedArgsToLogs([event]);
      listenerWithIndexedArgs(logsWithIndexedArgs);
    };

    contract.on(filter, listener);

    return () => {
      contract.off(filter, listener);
    };
  }, [deployedContractData, targetNetwork.rpcUrl, eventName, listenerWithIndexedArgs]);
};
