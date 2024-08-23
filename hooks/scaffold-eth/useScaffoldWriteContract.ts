import { useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import type { Abi, ExtractAbiFunctionNames } from "abitype";
import { useAccount, useWriteContract, useWalletClient } from "wagmi";
import { writeContract } from "@wagmi/core";
import type { WriteContractParameters as WagmiWriteContractParameters, WriteContractReturnType } from "@wagmi/core";
import type { WriteContractParameters as ViemWriteContractParameters, Account, Chain } from "viem";
import type { Hash, Address } from "viem";
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
  writeContractConfig?: Omit<WagmiWriteContractParameters, 'abi' | 'address' | 'functionName'>
) => {
  const { chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const writeTx = useTransactor();
  const [isMining, setIsMining] = useState(false);
  const { targetNetwork } = useTargetNetwork();

  type WriteContractFunction = <TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "nonpayable" | "payable">>(
    variables: ScaffoldWriteContractVariables<TContractName, TFunctionName>,
    options?: ScaffoldWriteContractOptions
  ) => Promise<Hash | undefined>;

  type WriteContractPreparedFunction = <TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "nonpayable" | "payable">>(
    variables: ScaffoldWriteContractVariables<TContractName, TFunctionName>,
    options?: Omit<ScaffoldWriteContractOptions, "onBlockConfirmation" | "blockConfirmations">
  ) => Promise<void>;

  const { data: deployedContractData } = useDeployedContractInfo(contractName);

  const { writeContractAsync } = useWriteContract();

  const sendContractWriteAsyncTx: WriteContractFunction = async (variables, options) => {
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
      const { blockConfirmations, onBlockConfirmation } = options ?? {};

      const config: Required<{
        abi: Abi;
        address: `0x${string}`;
        functionName: string;
        args: readonly unknown[];
        account: `0x${string}` | undefined;
        chain: Chain | undefined;
        value: bigint | undefined;
        gas: bigint | undefined;
        gasPrice: bigint | undefined;
        maxFeePerGas: bigint | undefined;
        maxPriorityFeePerGas: bigint | undefined;
        nonce: number | undefined;
        __mode?: 'prepared' | undefined;
      }> = {
        ...writeContractConfig,
        abi: deployedContractData.abi,
        address: deployedContractData.address,
        functionName: variables.functionName as string,
        args: variables.args ?? [],
        account: walletClient?.account?.address,
        chain: undefined,
        value: variables.value ?? undefined,
        gas: variables.gas ?? undefined,
        gasPrice: variables.gasPrice ?? undefined,
        maxFeePerGas: variables.maxFeePerGas ?? undefined,
        maxPriorityFeePerGas: variables.maxPriorityFeePerGas ?? undefined,
        nonce: variables.nonce ?? undefined,
        __mode: undefined,
      };

      const result = await writeContractAsync(config as WagmiWriteContractParameters);

      if (blockConfirmations || onBlockConfirmation) {
        await writeTx(
          async () => result,
          { blockConfirmations, onBlockConfirmation } as TransactorFuncOptions
        );
      }

      return result;
    } catch (e) {
      console.error("Error in sendContractWriteAsyncTx:", e);
      notification.error(`Failed to send transaction: ${e instanceof Error ? e.message : String(e)}`);
      return undefined;
    } finally {
      setIsMining(false);
    }
  };

  const sendContractWriteTx: WriteContractPreparedFunction = async (variables, options) => {
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
      const config = {
        abi: deployedContractData.abi,
        address: deployedContractData.address,
        functionName: variables.functionName as string,
        args: variables.args ?? undefined,
        ...writeContractConfig,
        value: variables.value,
        gas: variables.gas,
        gasPrice: variables.gasPrice,
        maxFeePerGas: variables.maxFeePerGas,
        maxPriorityFeePerGas: variables.maxPriorityFeePerGas,
        nonce: variables.nonce,
      } as const;

      // Remove undefined properties
      const cleanedConfig = Object.fromEntries(
        Object.entries(config).filter(([_, value]) => value !== undefined)
      ) as WagmiWriteContractParameters;

      const result = await writeContractAsync(config as WagmiWriteContractParameters);

      if (options?.onSuccess) {
        options.onSuccess(
          { hash: result },
          variables as ViemWriteContractParameters,
          config as WagmiWriteContractParameters
        );
      }
    } catch (error) {
      console.error("Error in sendContractWriteTx:", error);
      notification.error("Failed to send transaction. Please try again.");
      if (options?.onError) {
        options.onError(
          error instanceof Error ? error : new Error(String(error)),
          variables as ViemWriteContractParameters,
          {
            ...writeContractConfig,
            abi: deployedContractData.abi,
            address: deployedContractData.address,
            functionName: variables.functionName,
          } as WagmiWriteContractParameters
        );
      }
    }
  };

  return {
    writeContractAsync: sendContractWriteAsyncTx,
    writeContract: sendContractWriteTx,
    isLoading: isMining,
    config: {
      ...writeContractConfig,
      ...(deployedContractData && {
        address: deployedContractData.address,
        abi: deployedContractData.abi,
      }),
    },
    write: async (args?: Omit<WagmiWriteContractParameters, 'abi' | 'address'>): Promise<Hash> => {
      if (!deployedContractData) {
        throw new Error("Contract data is not available");
      }
      if (!args?.functionName) {
        throw new Error("Function name is required");
      }
      const result = await writeContractAsync({
        ...args,
        address: deployedContractData.address,
        abi: deployedContractData.abi,
        functionName: args.functionName,
      } as ViemWriteContractParameters);
      return result;
    },
  };
};
