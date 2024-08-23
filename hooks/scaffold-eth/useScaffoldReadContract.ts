import { useEffect } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useQueryClient } from "@tanstack/react-query";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import type { ExtractAbiFunctionNames } from "abitype";
import type { ReadContractErrorType } from "viem";
import { useBlockNumber, useContractRead } from "wagmi";
import type { UseReadContractParameters } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import type {
  AbiFunctionReturnType,
  ContractAbi,
  ContractName,
  UseScaffoldReadConfig,
} from "~~/utils/scaffold-eth/contract";

/**
 * Wrapper around wagmi's useContractRead hook which automatically loads (by name) the contract ABI and address from
 * the contracts present in deployedContracts.ts & externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 * @param config - The config settings, including extra wagmi configuration
 * @param config.contractName - deployed contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - args to be passed to the function call
 */
export const useScaffoldReadContract = <
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "pure" | "view">,
>({
  contractName,
  functionName,
  args,
  ...readConfig
}: UseScaffoldReadConfig<TContractName, TFunctionName>): Omit<ReturnType<typeof useContractRead>, "data" | "refetch"> & {
  data: AbiFunctionReturnType<ContractAbi<TContractName>, TFunctionName> | undefined;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<AbiFunctionReturnType<ContractAbi<TContractName>, TFunctionName>, ReadContractErrorType>>;
} => {
  const { data: deployedContract } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();
  const { query: queryOptions, watch, ...readContractConfig } = readConfig;
  // set watch to true by default
  const defaultWatch = watch ?? true;

  const readContractHookRes = useContractRead({
    chainId: targetNetwork.id,
    functionName,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    args: args as readonly unknown[],
    ...readContractConfig,
    enabled: !Array.isArray(args) || !args.some(arg => arg === undefined),
    ...queryOptions,
  });

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({
    watch: defaultWatch,
    chainId: targetNetwork.id,
    query: {
      enabled: defaultWatch,
    },
  });

  useEffect(() => {
    if (defaultWatch) {
      queryClient.invalidateQueries({ queryKey: readContractHookRes.queryKey });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  return {
    ...readContractHookRes,
    data: readContractHookRes.data as AbiFunctionReturnType<ContractAbi<TContractName>, TFunctionName> | undefined,
    refetch: readContractHookRes.refetch as (
      options?: RefetchOptions | undefined,
    ) => Promise<QueryObserverResult<AbiFunctionReturnType<ContractAbi<TContractName>, TFunctionName>, ReadContractErrorType>>,
  };
};
