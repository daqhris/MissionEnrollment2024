// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface IERC721Receiver$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "IERC721Receiver",
  "sourceName": "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "onERC721Received",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
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
    contractName: "IERC721Receiver",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<IERC721Receiver$Type["abi"]>>;
  export function deployContract(
    contractName: "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol:IERC721Receiver",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<IERC721Receiver$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "IERC721Receiver",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<IERC721Receiver$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol:IERC721Receiver",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<IERC721Receiver$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "IERC721Receiver",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<IERC721Receiver$Type["abi"]>>;
  export function getContractAt(
    contractName: "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol:IERC721Receiver",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<IERC721Receiver$Type["abi"]>>;
}
