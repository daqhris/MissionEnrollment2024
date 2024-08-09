// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface ITextResolver$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "ITextResolver",
  "sourceName": "contracts/resolvers/profiles/ITextResolver.sol",
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "node",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "indexedKey",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "key",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        }
      ],
      "name": "TextChanged",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "node",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "key",
          "type": "string"
        }
      ],
      "name": "text",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
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
    contractName: "ITextResolver",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<ITextResolver$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/resolvers/profiles/ITextResolver.sol:ITextResolver",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<ITextResolver$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "ITextResolver",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<ITextResolver$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/resolvers/profiles/ITextResolver.sol:ITextResolver",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<ITextResolver$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "ITextResolver",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<ITextResolver$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/resolvers/profiles/ITextResolver.sol:ITextResolver",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<ITextResolver$Type["abi"]>>;
}
