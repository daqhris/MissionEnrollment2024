// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface Controllable$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "Controllable",
  "sourceName": "contracts/root/Controllable.sol",
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "controller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        }
      ],
      "name": "ControllerChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "controllers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "controller",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        }
      ],
      "name": "setController",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561001057600080fd5b5061001a3361001f565b61006f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6103718061007e6000396000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c8063da8c229e11610050578063da8c229e14610096578063e0dba60f146100c9578063f2fde38b146100dc57600080fd5b8063715018a61461006c5780638da5cb5b14610076575b600080fd5b6100746100ef565b005b6000546040516001600160a01b0390911681526020015b60405180910390f35b6100b96100a43660046102dd565b60016020526000908152604090205460ff1681565b604051901515815260200161008d565b6100746100d73660046102ff565b610103565b6100746100ea3660046102dd565b61016a565b6100f76101ff565b6101016000610259565b565b61010b6101ff565b6001600160a01b038216600081815260016020908152604091829020805460ff191685151590811790915591519182527f4c97694570a07277810af7e5669ffd5f6a2d6b74b6e9a274b8b870fd5114cf87910160405180910390a25050565b6101726101ff565b6001600160a01b0381166101f35760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6101fc81610259565b50565b6000546001600160a01b031633146101015760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016101ea565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80356001600160a01b03811681146102d857600080fd5b919050565b6000602082840312156102ef57600080fd5b6102f8826102c1565b9392505050565b6000806040838503121561031257600080fd5b61031b836102c1565b91506020830135801515811461033057600080fd5b80915050925092905056fea2646970667358221220b701ad726c8e154c7696c606e81dd979a1ae53be6df67783168133d8ce634ad464736f6c63430008110033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100675760003560e01c8063da8c229e11610050578063da8c229e14610096578063e0dba60f146100c9578063f2fde38b146100dc57600080fd5b8063715018a61461006c5780638da5cb5b14610076575b600080fd5b6100746100ef565b005b6000546040516001600160a01b0390911681526020015b60405180910390f35b6100b96100a43660046102dd565b60016020526000908152604090205460ff1681565b604051901515815260200161008d565b6100746100d73660046102ff565b610103565b6100746100ea3660046102dd565b61016a565b6100f76101ff565b6101016000610259565b565b61010b6101ff565b6001600160a01b038216600081815260016020908152604091829020805460ff191685151590811790915591519182527f4c97694570a07277810af7e5669ffd5f6a2d6b74b6e9a274b8b870fd5114cf87910160405180910390a25050565b6101726101ff565b6001600160a01b0381166101f35760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6101fc81610259565b50565b6000546001600160a01b031633146101015760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016101ea565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80356001600160a01b03811681146102d857600080fd5b919050565b6000602082840312156102ef57600080fd5b6102f8826102c1565b9392505050565b6000806040838503121561031257600080fd5b61031b836102c1565b91506020830135801515811461033057600080fd5b80915050925092905056fea2646970667358221220b701ad726c8e154c7696c606e81dd979a1ae53be6df67783168133d8ce634ad464736f6c63430008110033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "contracts/root/Controllable.sol:Controllable",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<Controllable$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "contracts/root/Controllable.sol:Controllable",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<Controllable$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "contracts/root/Controllable.sol:Controllable",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<Controllable$Type["abi"]>>;
}
