import { DisplayVariable } from "./DisplayVariable";
import type { Abi, AbiFunction } from "abitype";
import type { Contract, ContractName, GenericContract, InheritedFunctions } from "~~/utils/scaffold-eth/contract";

interface FunctionDisplay {
  fn: AbiFunction;
  inheritedFrom?: string | undefined;
}

export const ContractVariables = ({
  refreshDisplayVariables,
  deployedContractData,
}: {
  refreshDisplayVariables: boolean;
  deployedContractData: Contract<ContractName>;
}): JSX.Element | null => {
  if (!deployedContractData) {
    return null;
  }

  const functionsToDisplay = (
    (deployedContractData.abi as Abi).filter((part): part is AbiFunction => part.type === "function")
  )
    .filter((fn: AbiFunction): boolean => {
      const isQueryableWithNoParams =
        (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;
      return isQueryableWithNoParams;
    })
    .map((fn: AbiFunction): FunctionDisplay => {
      return {
        fn,
        inheritedFrom: ((deployedContractData as GenericContract)?.inheritedFunctions as InheritedFunctions)?.[fn.name] ?? undefined,
      };
    })
    .sort((a: FunctionDisplay, b: FunctionDisplay): number =>
      (b.inheritedFrom && a.inheritedFrom) ? b.inheritedFrom.localeCompare(a.inheritedFrom) : b.inheritedFrom ? -1 : a.inheritedFrom ? 1 : 0
    );

  if (!functionsToDisplay.length) {
    return <>No contract variables</>;
  }

  return (
    <>
      {functionsToDisplay.map(({ fn, inheritedFrom }: FunctionDisplay) => (
        <DisplayVariable
          abi={deployedContractData.abi as Abi}
          abiFunction={fn}
          contractAddress={deployedContractData.address}
          key={fn.name}
          refreshDisplayVariables={refreshDisplayVariables}
          inheritedFrom={inheritedFrom || undefined}
        />
      ))}
    </>
  );
};
