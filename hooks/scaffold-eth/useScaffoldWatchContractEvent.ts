import { useTargetNetwork } from "./useTargetNetwork";
import { Abi, ExtractAbiEventNames } from "abitype";
import { Log } from "viem";
import { useWatchContractEvent } from "wagmi";
import { addIndexedArgsToEvent, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { ContractAbi, ContractName, UseScaffoldEventConfig } from "~~/utils/scaffold-eth/contract";
// TODO: Import POAP API client and necessary types
// import { POAPClient } from '@poap/poap-eth-sdk';

/**
 * Wrapper around wagmi's useEventSubscriber hook which automatically loads (by name) the contract ABI and
 * address from the contracts present in deployedContracts.ts & externalContracts.ts
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.eventName - name of the event to listen for
 * @param config.onLogs - the callback that receives events.
 */
export const useScaffoldWatchContractEvent = <
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
>({
  contractName,
  eventName,
  onLogs,
}: UseScaffoldEventConfig<TContractName, TEventName>) => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();

  const addIndexedArgsToLogs = (logs: Log[]) => logs.map(addIndexedArgsToEvent);
  const listenerWithIndexedArgs = (logs: Log[]) => onLogs(addIndexedArgsToLogs(logs) as Parameters<typeof onLogs>[0]);

  // TODO: Integrate POAP protocol
  // - Check if the event is related to POAP (e.g., POAP minting or transfer)
  // - If it's a POAP event, fetch additional data from POAP API
  // - Combine POAP data with blockchain event data

  return useWatchContractEvent({
    address: deployedContractData?.address,
    abi: deployedContractData?.abi as Abi,
    chainId: targetNetwork.id,
    onLogs: listenerWithIndexedArgs,
    eventName,
  });
};
