// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";
import type { Address } from "viem";

export interface SignedMath$Type {
  _format: "hh-sol-artifact-1";
  contractName: "SignedMath";
  sourceName: "@openzeppelin/contracts/utils/math/SignedMath.sol";
  abi: [];
  bytecode: "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220dc2601a8ebafb156ba6826e1cb7115b77a99a52198364a46aaf80ef3e75275ac64736f6c63430008110033";
  deployedBytecode: "0x73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220dc2601a8ebafb156ba6826e1cb7115b77a99a52198364a46aaf80ef3e75275ac64736f6c63430008110033";
  linkReferences: {};
  deployedLinkReferences: {};
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "SignedMath",
    constructorArgs?: [],
    config?: DeployContractConfig,
  ): Promise<GetContractReturnType<SignedMath$Type["abi"]>>;
  export function deployContract(
    contractName: "@openzeppelin/contracts/utils/math/SignedMath.sol:SignedMath",
    constructorArgs?: [],
    config?: DeployContractConfig,
  ): Promise<GetContractReturnType<SignedMath$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "SignedMath",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig,
  ): Promise<{
    contract: GetContractReturnType<SignedMath$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "@openzeppelin/contracts/utils/math/SignedMath.sol:SignedMath",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig,
  ): Promise<{
    contract: GetContractReturnType<SignedMath$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "SignedMath",
    address: Address,
    config?: GetContractAtConfig,
  ): Promise<GetContractReturnType<SignedMath$Type["abi"]>>;
  export function getContractAt(
    contractName: "@openzeppelin/contracts/utils/math/SignedMath.sol:SignedMath",
    address: Address,
    config?: GetContractAtConfig,
  ): Promise<GetContractReturnType<SignedMath$Type["abi"]>>;
}
