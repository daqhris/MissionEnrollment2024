import { useEffect, useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Abi, AbiEvent, ExtractAbiEventNames } from "abitype";
import type { BlockNumber, GetLogsParameters, Log } from "viem";
import { useBlockNumber, usePublicClient } from "wagmi";
import type { Config, UsePublicClientReturnType } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import type {
  ContractAbi,
  ContractName,
  UseScaffoldEventHistoryConfig,
  UseScaffoldEventHistoryData,
} from "~~/utils/scaffold-eth/contract";

// import { POAPClient, POAPEvent } from '@poap/poap-eth';

const getEvents = async (
  getLogsParams: GetLogsParameters<AbiEvent | undefined, AbiEvent[] | undefined, boolean, BlockNumber, BlockNumber>,
  publicClient?: UsePublicClientReturnType<Config, number>,
  Options?: {
    blockData?: boolean;
    transactionData?: boolean;
    receiptData?: boolean;
  },
) => {
  const logs = await publicClient?.getLogs({
    address: getLogsParams.address,
    fromBlock: getLogsParams.fromBlock,
    args: getLogsParams.args,
    event: getLogsParams.event,
  });
  if (!logs) return undefined;

  const finalEvents = await Promise.all(
    logs.map(async log => {
      return {
        ...log,
        blockData:
          Options?.blockData && log.blockHash ? await publicClient?.getBlock({ blockHash: log.blockHash }) : null,
        transactionData:
          Options?.transactionData && log.transactionHash
            ? await publicClient?.getTransaction({ hash: log.transactionHash })
            : null,
        receiptData:
          Options?.receiptData && log.transactionHash
            ? await publicClient?.getTransactionReceipt({ hash: log.transactionHash })
            : null,
      };
    }),
  );

  return finalEvents;
};

/**
 * Reads events from a deployed contract and integrates with POAP protocol
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.eventName - name of the event to listen for
 * @param config.fromBlock - the block number to start reading events from
 * @param config.filters - filters to be applied to the event (parameterName: value)
 * @param config.blockData - if set to true it will return the block data for each event (default: false)
 * @param config.transactionData - if set to true it will return the transaction data for each event (default: false)
 * @param config.receiptData - if set to true it will return the receipt data for each event (default: false)
 * @param config.watch - if set to true, the events will be updated every pollingInterval milliseconds set at scaffoldConfig (default: false)
 * @param config.enabled - set this to false to disable the hook from running (default: true)
 * @param config.poapIntegration - if set to true, it will integrate with POAP protocol (default: false)
 * @param config.address - the address to use for POAP integration
 */
export const useScaffoldEventHistory = <
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
  TBlockData extends boolean = false,
  TTransactionData extends boolean = false,
  TReceiptData extends boolean = false,
>({
  contractName,
  eventName,
  fromBlock,
  filters,
  blockData,
  transactionData,
  receiptData,
  watch,
  enabled = true,
  poapIntegration = false,
  address,
}: UseScaffoldEventHistoryConfig<TContractName, TEventName, TBlockData, TTransactionData, TReceiptData> & {
  poapIntegration?: boolean;
  address?: string;
}) => {
  const { targetNetwork } = useTargetNetwork();
  const publicClient = usePublicClient({
    chainId: targetNetwork.id,
  });
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [poapData, setPoapData] = useState<Record<string, unknown> | null>(null);

  // POAP integration logic
  useEffect(() => {
    if (poapIntegration && address) {
      const fetchPOAPData = async () => {
        try {
          // TODO: Replace with actual POAP API call when API key is available
          const response = await fetch(`https://api.poap.tech/actions/scan/${address}`);
          if (!response.ok) {
            throw new Error("Failed to fetch POAP data");
          }
          const poapData = await response.json();
          // TODO: Process and store POAP data
          console.log("POAP data:", poapData);
          setPoapData(poapData);
        } catch (error) {
          console.error("Error fetching POAP data:", error);
        }
      };
      fetchPOAPData();
    }
  }, [poapIntegration, address]);

  const { data: blockNumber } = useBlockNumber({ watch: watch, chainId: targetNetwork.id });

  const { data: deployedContractData } = useDeployedContractInfo(contractName);

  const event =
    deployedContractData &&
    ((deployedContractData.abi as Abi).find(part => part.type === "event" && part.name === eventName) as AbiEvent);

  const isContractAddressAndClientReady = Boolean(deployedContractData?.address) && Boolean(publicClient);

  const query = useInfiniteQuery({
    queryKey: [
      "eventHistory",
      {
        contractName,
        address: deployedContractData?.address,
        eventName,
        fromBlock: fromBlock.toString(),
        chainId: targetNetwork.id,
      },
    ],
    queryFn: async ({ pageParam }) => {
      if (!isContractAddressAndClientReady) return undefined;
      const options = {
        blockData: blockData ? true : undefined,
        transactionData: transactionData ? true : undefined,
        receiptData: receiptData ? true : undefined,
      };
      const data = await getEvents(
        { address: deployedContractData?.address, event, fromBlock: pageParam, args: filters },
        publicClient,
        options as { blockData?: boolean; transactionData?: boolean; receiptData?: boolean },
      );

      return data;
    },
    enabled: enabled && isContractAddressAndClientReady,
    initialPageParam: fromBlock,
    getNextPageParam: () => {
      return blockNumber;
    },
    select: data => {
      const events = data.pages.flat();
      const eventHistoryData = events?.map(event => addIndexedArgsToEvent(event as any)) as UseScaffoldEventHistoryData<
        TContractName,
        TEventName,
        TBlockData,
        TTransactionData,
        TReceiptData
      > | undefined;
      return {
        pages: eventHistoryData?.reverse() ?? [],
        pageParams: data.pageParams,
      };
    },
  });

  useEffect(() => {
    const shouldSkipEffect = !blockNumber || !watch || isFirstRender;
    if (shouldSkipEffect) {
      // skipping on first render, since on first render we should call queryFn with
      // fromBlock value, not blockNumber
      if (isFirstRender) setIsFirstRender(false);
      return;
    }

    query.fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, watch]);

  return {
    data: query.data?.pages,
    status: query.status,
    error: query.error,
    isLoading: query.isLoading,
    isFetchingNewEvent: query.isFetchingNextPage,
    refetch: query.refetch,
  };
};

export const addIndexedArgsToEvent = (event: { args?: Record<string, unknown>; log?: Log }): { args?: Record<string, unknown>; log?: Log } => {
  if (event.args && !Array.isArray(event.args)) {
    return { ...event, args: { ...event.args, ...Object.values(event.args) } };
  }

  return event;
};
