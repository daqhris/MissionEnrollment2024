import { useTargetNetwork } from "./useTargetNetwork";
import type { Abi, Log } from "viem";
import { useContractEvent } from "wagmi";
import type { UseContractEventConfig } from "wagmi";
import { addIndexedArgsToEvent, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import type { ContractName, UseScaffoldEventConfig } from "~~/utils/scaffold-eth/contract";

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
}: UseScaffoldEventConfig<TContractName, TEventName>): ReturnType<typeof useContractEvent> => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();

  const addIndexedArgsToLogs = (logs: Log[]): Log[] => logs.map(addIndexedArgsToEvent);
  const listenerWithIndexedArgs = (logs: Log[]): void => listener(addIndexedArgsToLogs(logs) as Parameters<typeof listener>[0]);

  // TODO: Integrate POAP protocol
  // - Check if the event is related to POAP (e.g., POAP minting or transfer)
  // - If it's a POAP event, fetch additional data from POAP API
  // - Combine POAP data with blockchain event data

  return useContractEvent({
    address: deployedContractData?.address,
    abi: deployedContractData?.abi as Abi,
    chainId: targetNetwork.id,
    eventName,
    listener: listenerWithIndexedArgs,
  } as UseContractEventConfig);
};
