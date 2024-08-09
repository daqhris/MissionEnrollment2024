// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface DummyOffchainResolver$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "DummyOffchainResolver",
  "sourceName": "contracts/test/mocks/DummyOffchainResolver.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "string[]",
          "name": "urls",
          "type": "string[]"
        },
        {
          "internalType": "bytes",
          "name": "callData",
          "type": "bytes"
        },
        {
          "internalType": "bytes4",
          "name": "callbackFunction",
          "type": "bytes4"
        },
        {
          "internalType": "bytes",
          "name": "extraData",
          "type": "bytes"
        }
      ],
      "name": "OffchainLookup",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "addr",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "resolve",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "response",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "extraData",
          "type": "bytes"
        }
      ],
      "name": "resolveCallback",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
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
  "bytecode": "0x608060405234801561001057600080fd5b5061071b806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806301ffc9a7146100515780633b3b57de146100795780639061b923146100c5578063b4a85801146100e5575b600080fd5b61006461005f366004610438565b6100f8565b60405190151581526020015b60405180910390f35b6100a0610087366004610469565b507369420f05a11f617b4b74ffe2e04b2d300dfa556f90565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610070565b6100d86100d33660046104cb565b610161565b604051610070919061057d565b6100d86100f33660046104cb565b6102ea565b60006001600160e01b031982167f9061b92300000000000000000000000000000000000000000000000000000000148061015b57507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b03198316145b92915050565b60408051600180825281830190925260609160009190816020015b606081526020019060019003908161017c5790505090506040518060400160405280601481526020017f68747470733a2f2f6578616d706c652e636f6d2f000000000000000000000000815250816000815181106101dc576101dc610590565b60209081029190910101527f123456780000000000000000000000000000000000000000000000000000000061021284866105bf565b6001600160e01b03191603610279576040516020016102629060208082526003908201527f666f6f0000000000000000000000000000000000000000000000000000000000604082015260600190565b6040516020818303038152906040529150506102e2565b6040517f556f18300000000000000000000000000000000000000000000000000000000081526102d99030908390879087907fb4a85801000000000000000000000000000000000000000000000000000000009083908390600401610618565b60405180910390fd5b949350505050565b606082826040516102fc9291906106d5565b604051809103902085856040516103149291906106d5565b604051809103902014610383576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f526573706f6e73652064617461206572726f720000000000000000000000000060448201526064016102d9565b7f691f3431000000000000000000000000000000000000000000000000000000006103ae83856105bf565b6001600160e01b03191603610414576040516020016103fe9060208082526011908201527f6f6666636861696e2e746573742e657468000000000000000000000000000000604082015260600190565b60405160208183030381529060405290506102e2565b60408051306020820152016040516020818303038152906040529050949350505050565b60006020828403121561044a57600080fd5b81356001600160e01b03198116811461046257600080fd5b9392505050565b60006020828403121561047b57600080fd5b5035919050565b60008083601f84011261049457600080fd5b50813567ffffffffffffffff8111156104ac57600080fd5b6020830191508360208285010111156104c457600080fd5b9250929050565b600080600080604085870312156104e157600080fd5b843567ffffffffffffffff808211156104f957600080fd5b61050588838901610482565b9096509450602087013591508082111561051e57600080fd5b5061052b87828801610482565b95989497509550505050565b6000815180845260005b8181101561055d57602081850181015186830182015201610541565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006104626020830184610537565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6001600160e01b031981358181169160048510156105e75780818660040360031b1b83161692505b505092915050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b600060a0820173ffffffffffffffffffffffffffffffffffffffff8a168352602060a081850152818a5180845260c08601915060c08160051b8701019350828c0160005b8281101561068a5760bf19888703018452610678868351610537565b9550928401929084019060010161065c565b505050505082810360408401526106a281888a6105ef565b6001600160e01b031987166060850152905082810360808401526106c78185876105ef565b9a9950505050505050505050565b818382376000910190815291905056fea2646970667358221220547d7f8106aa834e2a0b5aa0fcf60bffc80731ce2f1c16e62c63c6263c388f1864736f6c63430008110033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b506004361061004c5760003560e01c806301ffc9a7146100515780633b3b57de146100795780639061b923146100c5578063b4a85801146100e5575b600080fd5b61006461005f366004610438565b6100f8565b60405190151581526020015b60405180910390f35b6100a0610087366004610469565b507369420f05a11f617b4b74ffe2e04b2d300dfa556f90565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610070565b6100d86100d33660046104cb565b610161565b604051610070919061057d565b6100d86100f33660046104cb565b6102ea565b60006001600160e01b031982167f9061b92300000000000000000000000000000000000000000000000000000000148061015b57507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b03198316145b92915050565b60408051600180825281830190925260609160009190816020015b606081526020019060019003908161017c5790505090506040518060400160405280601481526020017f68747470733a2f2f6578616d706c652e636f6d2f000000000000000000000000815250816000815181106101dc576101dc610590565b60209081029190910101527f123456780000000000000000000000000000000000000000000000000000000061021284866105bf565b6001600160e01b03191603610279576040516020016102629060208082526003908201527f666f6f0000000000000000000000000000000000000000000000000000000000604082015260600190565b6040516020818303038152906040529150506102e2565b6040517f556f18300000000000000000000000000000000000000000000000000000000081526102d99030908390879087907fb4a85801000000000000000000000000000000000000000000000000000000009083908390600401610618565b60405180910390fd5b949350505050565b606082826040516102fc9291906106d5565b604051809103902085856040516103149291906106d5565b604051809103902014610383576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f526573706f6e73652064617461206572726f720000000000000000000000000060448201526064016102d9565b7f691f3431000000000000000000000000000000000000000000000000000000006103ae83856105bf565b6001600160e01b03191603610414576040516020016103fe9060208082526011908201527f6f6666636861696e2e746573742e657468000000000000000000000000000000604082015260600190565b60405160208183030381529060405290506102e2565b60408051306020820152016040516020818303038152906040529050949350505050565b60006020828403121561044a57600080fd5b81356001600160e01b03198116811461046257600080fd5b9392505050565b60006020828403121561047b57600080fd5b5035919050565b60008083601f84011261049457600080fd5b50813567ffffffffffffffff8111156104ac57600080fd5b6020830191508360208285010111156104c457600080fd5b9250929050565b600080600080604085870312156104e157600080fd5b843567ffffffffffffffff808211156104f957600080fd5b61050588838901610482565b9096509450602087013591508082111561051e57600080fd5b5061052b87828801610482565b95989497509550505050565b6000815180845260005b8181101561055d57602081850181015186830182015201610541565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006104626020830184610537565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6001600160e01b031981358181169160048510156105e75780818660040360031b1b83161692505b505092915050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b600060a0820173ffffffffffffffffffffffffffffffffffffffff8a168352602060a081850152818a5180845260c08601915060c08160051b8701019350828c0160005b8281101561068a5760bf19888703018452610678868351610537565b9550928401929084019060010161065c565b505050505082810360408401526106a281888a6105ef565b6001600160e01b031987166060850152905082810360808401526106c78185876105ef565b9a9950505050505050505050565b818382376000910190815291905056fea2646970667358221220547d7f8106aa834e2a0b5aa0fcf60bffc80731ce2f1c16e62c63c6263c388f1864736f6c63430008110033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "DummyOffchainResolver",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<DummyOffchainResolver$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/test/mocks/DummyOffchainResolver.sol:DummyOffchainResolver",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<DummyOffchainResolver$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "DummyOffchainResolver",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<DummyOffchainResolver$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/test/mocks/DummyOffchainResolver.sol:DummyOffchainResolver",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<DummyOffchainResolver$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "DummyOffchainResolver",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<DummyOffchainResolver$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/test/mocks/DummyOffchainResolver.sol:DummyOffchainResolver",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<DummyOffchainResolver$Type["abi"]>>;
}
