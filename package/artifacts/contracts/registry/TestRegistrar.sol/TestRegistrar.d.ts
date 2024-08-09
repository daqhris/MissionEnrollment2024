// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { AbiParameterToPrimitiveType, GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface TestRegistrar$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "TestRegistrar",
  "sourceName": "contracts/registry/TestRegistrar.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "contract ENS",
          "name": "ensAddr",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "node",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "ens",
      "outputs": [
        {
          "internalType": "contract ENS",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "expiryTimes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "label",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "register",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rootNode",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x60c060405234801561001057600080fd5b506040516103ca3803806103ca83398101604081905261002f91610045565b6001600160a01b0390911660805260a05261007f565b6000806040838503121561005857600080fd5b82516001600160a01b038116811461006f57600080fd5b6020939093015192949293505050565b60805160a05161031a6100b06000396000818160ea015261016d015260008181605601526101b7015261031a6000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80633f15457f14610051578063af9f26e4146100a2578063d22057a9146100d0578063faff50a8146100e5575b600080fd5b6100787f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020015b60405180910390f35b6100c26100b0366004610229565b60006020819052908152604090205481565b604051908152602001610099565b6100e36100de366004610242565b61010c565b005b6100c27f000000000000000000000000000000000000000000000000000000000000000081565b600082815260208190526040902054421161012657600080fd5b6101336224ea004261028b565b6000838152602081905260409081902091909155517f06ab59230000000000000000000000000000000000000000000000000000000081527f000000000000000000000000000000000000000000000000000000000000000060048201526024810183905273ffffffffffffffffffffffffffffffffffffffff82811660448301527f000000000000000000000000000000000000000000000000000000000000000016906306ab5923906064016020604051808303816000875af1158015610200573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061022491906102cb565b505050565b60006020828403121561023b57600080fd5b5035919050565b6000806040838503121561025557600080fd5b82359150602083013573ffffffffffffffffffffffffffffffffffffffff8116811461028057600080fd5b809150509250929050565b808201808211156102c5577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b92915050565b6000602082840312156102dd57600080fd5b505191905056fea2646970667358221220dafb5d4cc68f4dda39d64fca7aef8fba2b8f9edd57bf44240f2430a79395078664736f6c63430008110033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b506004361061004c5760003560e01c80633f15457f14610051578063af9f26e4146100a2578063d22057a9146100d0578063faff50a8146100e5575b600080fd5b6100787f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020015b60405180910390f35b6100c26100b0366004610229565b60006020819052908152604090205481565b604051908152602001610099565b6100e36100de366004610242565b61010c565b005b6100c27f000000000000000000000000000000000000000000000000000000000000000081565b600082815260208190526040902054421161012657600080fd5b6101336224ea004261028b565b6000838152602081905260409081902091909155517f06ab59230000000000000000000000000000000000000000000000000000000081527f000000000000000000000000000000000000000000000000000000000000000060048201526024810183905273ffffffffffffffffffffffffffffffffffffffff82811660448301527f000000000000000000000000000000000000000000000000000000000000000016906306ab5923906064016020604051808303816000875af1158015610200573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061022491906102cb565b505050565b60006020828403121561023b57600080fd5b5035919050565b6000806040838503121561025557600080fd5b82359150602083013573ffffffffffffffffffffffffffffffffffffffff8116811461028057600080fd5b809150509250929050565b808201808211156102c5577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b92915050565b6000602082840312156102dd57600080fd5b505191905056fea2646970667358221220dafb5d4cc68f4dda39d64fca7aef8fba2b8f9edd57bf44240f2430a79395078664736f6c63430008110033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "TestRegistrar",
    constructorArgs: [ensAddr: AbiParameterToPrimitiveType<{"name":"ensAddr","type":"address"}>, node: AbiParameterToPrimitiveType<{"name":"node","type":"bytes32"}>],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<TestRegistrar$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/registry/TestRegistrar.sol:TestRegistrar",
    constructorArgs: [ensAddr: AbiParameterToPrimitiveType<{"name":"ensAddr","type":"address"}>, node: AbiParameterToPrimitiveType<{"name":"node","type":"bytes32"}>],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<TestRegistrar$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "TestRegistrar",
    constructorArgs: [ensAddr: AbiParameterToPrimitiveType<{"name":"ensAddr","type":"address"}>, node: AbiParameterToPrimitiveType<{"name":"node","type":"bytes32"}>],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<TestRegistrar$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/registry/TestRegistrar.sol:TestRegistrar",
    constructorArgs: [ensAddr: AbiParameterToPrimitiveType<{"name":"ensAddr","type":"address"}>, node: AbiParameterToPrimitiveType<{"name":"node","type":"bytes32"}>],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<TestRegistrar$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "TestRegistrar",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<TestRegistrar$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/registry/TestRegistrar.sol:TestRegistrar",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<TestRegistrar$Type["abi"]>>;
}
