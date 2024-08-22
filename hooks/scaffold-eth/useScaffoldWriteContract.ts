import { useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import type { MutateOptions } from "@tanstack/react-query";
import type { Abi, ExtractAbiFunctionNames } from "abitype";
import { useAccount, useContractWrite } from "wagmi";
import type { UseContractWriteConfig, WriteContractResult } from "wagmi";
import type { Address, Hash } from "viem";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import type {
  ContractAbi,
  ContractName,
  ScaffoldWriteContractOptions,
  ScaffoldWriteContractVariables,
  TransactorFuncOptions
} from "~~/utils/scaffold-eth/contract";

/**
 * Wrapper around wagmi's useContractWrite hook which automatically loads (by name) the contract ABI and address from
 * the contracts present in deployedContracts.ts & externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 * @param contractName - name of the contract to be written to
 * @param writeContractConfig - wagmi's useContractWrite configuration
 */
export const useScaffoldWriteContract = <TContractName extends ContractName>(
  contractName: TContractName,
  writeContractConfig?: UseContractWriteConfig
): Omit<ReturnType<typeof useContractWrite>, 'writeAsync'> & {
  isMining: boolean;
  writeContractAsync: <TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "nonpayable" | "payable">>(
    variables: ScaffoldWriteContractVariables<TContractName, TFunctionName>,
    options?: ScaffoldWriteContractOptions
  ) => Promise<{ hash: `0x${string}` } | undefined>;
  writeContract: <TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "nonpayable" | "payable">>(
    variables: ScaffoldWriteContractVariables<TContractName, TFunctionName>,
    options?: Omit<ScaffoldWriteContractOptions, "onBlockConfirmation" | "blockConfirmations">
  ) => Promise<void>;
} => {
  const { chain } = useAccount();
  const writeTx = useTransactor();
  const [isMining, setIsMining] = useState(false);
  const { targetNetwork } = useTargetNetwork();

  const { data: deployedContractData } = useDeployedContractInfo(contractName);

  const wagmiContractWrite = useContractWrite({
    address: deployedContractData?.address,
    abi: deployedContractData?.abi,
    ...writeContractConfig,
  });

  const sendContractWriteAsyncTx = async <
    TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "nonpayable" | "payable">,
  >(
    variables: ScaffoldWriteContractVariables<TContractName, TFunctionName>,
    options?: ScaffoldWriteContractOptions,
  ): Promise<{ hash: `0x${string}` } | undefined> => {
    if (!deployedContractData) {
      notification.error("Target Contract is not deployed, did you forget to run `yarn deploy`?");
      return undefined;
    }

    if (!chain?.id) {
      notification.error("Please connect your wallet");
      return undefined;
    }
    if (chain.id !== targetNetwork.id) {
      notification.error("You are on the wrong network");
      return undefined;
    }

    try {
      setIsMining(true);
      const { blockConfirmations, onBlockConfirmation, ...mutateOptions } = options ?? {};
      const makeWriteWithParams = async () => {
        if (!wagmiContractWrite.writeContract) {
          throw new Error("writeContract function is not available");
        }
        const result = await wagmiContractWrite.writeContract({
          abi: deployedContractData.abi as Abi,
          address: deployedContractData.address,
          functionName: variables.functionName as string,
          args: variables.args,
        });
        if (typeof result === 'object' && 'hash' in result) {
          return result.hash;
        }
        throw new Error("Unexpected result from writeContract");
      };
      const writeTxResult = await writeTx(makeWriteWithParams, {
        blockConfirmations,
        onBlockConfirmation,
      } as TransactorFuncOptions);

      return { hash: writeTxResult };
    } catch (e) {
      console.error("Error in sendContractWriteAsyncTx:", e);
      throw e;
    } finally {
      setIsMining(false);
    }
  };

  const sendContractWriteTx = async <
    TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "nonpayable" | "payable">,
  >(
    variables: ScaffoldWriteContractVariables<TContractName, TFunctionName>,
    options?: Omit<ScaffoldWriteContractOptions, "onBlockConfirmation" | "blockConfirmations">,
  ): Promise<void> => {
    if (!deployedContractData) {
      notification.error("Target Contract is not deployed, did you forget to run `yarn deploy`?");
      return;
    }
    if (!chain?.id) {
      notification.error("Please connect your wallet");
      return;
    }
    if (chain.id !== targetNetwork.id) {
      notification.error("You are on the wrong network");
      return;
    }

    try {
      if (!wagmiContractWrite.writeContract) {
        throw new Error("writeContract function is not available");
      }
      const result = await wagmiContractWrite.writeContract({
        abi: deployedContractData.abi as Abi,
        address: deployedContractData.address as `0x${string}`,
        functionName: variables.functionName as string,
        args: variables.args,
      });

      if (options?.onSuccess && 'hash' in result) {
        options.onSuccess({ hash: result.hash }, variables as WriteContractParameters, options);
      }
    } catch (error) {
      console.error("Error in sendContractWriteTx:", error);
      notification.error("Failed to send transaction. Please try again.");
      if (options?.onError) {
        options.onError(error as Error, variables as WriteContractParameters, options);
      }
    }
  };

  return {
    ...wagmiContractWrite,
    isMining,
    writeContractAsync: sendContractWriteAsyncTx,
    writeContract: sendContractWriteTx,
  };
};
