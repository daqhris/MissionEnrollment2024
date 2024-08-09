// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface Multicallable$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "Multicallable",
  "sourceName": "contracts/resolvers/Multicallable.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "bytes[]",
          "name": "data",
          "type": "bytes[]"
        }
      ],
      "name": "multicall",
      "outputs": [
        {
          "internalType": "bytes[]",
          "name": "results",
          "type": "bytes[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "nodehash",
          "type": "bytes32"
        },
        {
          "internalType": "bytes[]",
          "name": "data",
          "type": "bytes[]"
        }
      ],
      "name": "multicallWithNodeCheck",
      "outputs": [
        {
          "internalType": "bytes[]",
          "name": "results",
          "type": "bytes[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceID",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x",
  "deployedBytecode": "0x",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "Multicallable",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<Multicallable$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/resolvers/Multicallable.sol:Multicallable",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<Multicallable$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "Multicallable",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<Multicallable$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/resolvers/Multicallable.sol:Multicallable",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<Multicallable$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "Multicallable",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<Multicallable$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/resolvers/Multicallable.sol:Multicallable",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<Multicallable$Type["abi"]>>;
}
