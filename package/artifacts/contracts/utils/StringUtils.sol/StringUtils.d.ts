// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface StringUtils$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "StringUtils",
  "sourceName": "contracts/utils/StringUtils.sol",
  "abi": [],
  "bytecode": "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220dfb377609774f6d6c80a379947bccbaf136f15539e51e3a155c86b9b0ea8645a64736f6c63430008110033",
  "deployedBytecode": "0x73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220dfb377609774f6d6c80a379947bccbaf136f15539e51e3a155c86b9b0ea8645a64736f6c63430008110033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "StringUtils",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<StringUtils$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/utils/StringUtils.sol:StringUtils",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<StringUtils$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "StringUtils",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<StringUtils$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/utils/StringUtils.sol:StringUtils",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<StringUtils$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "StringUtils",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<StringUtils$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/utils/StringUtils.sol:StringUtils",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<StringUtils$Type["abi"]>>;
}
