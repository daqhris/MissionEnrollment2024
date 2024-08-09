// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { AbiParameterToPrimitiveType, GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface ExponentialPremiumPriceOracle$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "ExponentialPremiumPriceOracle",
  "sourceName": "contracts/ethregistrar/ExponentialPremiumPriceOracle.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "contract AggregatorInterface",
          "name": "_usdOracle",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_rentPrices",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "_startPremium",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalDays",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "prices",
          "type": "uint256[]"
        }
      ],
      "name": "RentPriceChanged",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "startPremium",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "elapsed",
          "type": "uint256"
        }
      ],
      "name": "decayedPremium",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "expires",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        }
      ],
      "name": "premium",
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
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "expires",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        }
      ],
      "name": "price",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "base",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "premium",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPriceOracle.Price",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "price1Letter",
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
      "inputs": [],
      "name": "price2Letter",
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
      "inputs": [],
      "name": "price3Letter",
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
      "inputs": [],
      "name": "price4Letter",
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
      "inputs": [],
      "name": "price5Letter",
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
    },
    {
      "inputs": [],
      "name": "usdOracle",
      "outputs": [
        {
          "internalType": "contract AggregatorInterface",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x6101806040523480156200001257600080fd5b50604051620010863803806200108683398101604081905262000035916200012c565b6001600160a01b0384166101205282518490849081906000906200005d576200005d62000227565b6020026020010151608081815250508060018151811062000082576200008262000227565b602002602001015160a0818152505080600281518110620000a757620000a762000227565b602002602001015160c0818152505080600381518110620000cc57620000cc62000227565b602002602001015160e0818152505080600481518110620000f157620000f162000227565b60209081029190910101516101005250506101408290521c61016052506200023d9050565b634e487b7160e01b600052604160045260246000fd5b600080600080608085870312156200014357600080fd5b84516001600160a01b03811681146200015b57600080fd5b602086810151919550906001600160401b03808211156200017b57600080fd5b818801915088601f8301126200019057600080fd5b815181811115620001a557620001a562000116565b8060051b604051601f19603f83011681018181108582111715620001cd57620001cd62000116565b60405291825284820192508381018501918b831115620001ec57600080fd5b938501935b828510156200020c57845184529385019392850192620001f1565b60408b01516060909b0151999c909b50975050505050505050565b634e487b7160e01b600052603260045260246000fd5b60805160a05160c05160e05161010051610120516101405161016051610db3620002d3600039600081816108590152610883015260006108300152600081816101c7015261074b01526000818161015301526102d401526000818161023a015261030d01526000818161018d015261033f015260008181610213015261037101526000818160f0015261039b0152610db36000f3fe608060405234801561001057600080fd5b50600436106100be5760003560e01c8063a200e15311610076578063c8a4271f1161005b578063c8a4271f146101c2578063cd5d2c741461020e578063d820ed421461023557600080fd5b8063a200e15314610188578063a34e3596146101af57600080fd5b806350e9a715116100a757806350e9a7151461012057806359b6b86c1461014e57806359e1777c1461017557600080fd5b806301ffc9a7146100c35780632c0fd74c146100eb575b600080fd5b6100d66100d1366004610bdd565b61025c565b60405190151581526020015b60405180910390f35b6101127f000000000000000000000000000000000000000000000000000000000000000081565b6040519081526020016100e2565b61013361012e366004610c1f565b61026d565b604080518251815260209283015192810192909252016100e2565b6101127f000000000000000000000000000000000000000000000000000000000000000081565b610112610183366004610c9e565b610433565b6101127f000000000000000000000000000000000000000000000000000000000000000081565b6101126101bd366004610c1f565b6104ce565b6101e97f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100e2565b6101127f000000000000000000000000000000000000000000000000000000000000000081565b6101127f000000000000000000000000000000000000000000000000000000000000000081565b60006102678261051f565b92915050565b604080518082019091526000808252602082015260006102c286868080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506105b792505050565b90506000600582106102ff576102f8847f0000000000000000000000000000000000000000000000000000000000000000610cd6565b90506103c2565b81600403610331576102f8847f0000000000000000000000000000000000000000000000000000000000000000610cd6565b81600303610363576102f8847f0000000000000000000000000000000000000000000000000000000000000000610cd6565b81600203610395576102f8847f0000000000000000000000000000000000000000000000000000000000000000610cd6565b6103bf847f0000000000000000000000000000000000000000000000000000000000000000610cd6565b90505b60405180604001604052806103d683610746565b81526020016104266104218a8a8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508c92508b91506107fa9050565b610746565b9052979650505050505050565b6000806201518061044c670de0b6b3a764000085610cd6565b6104569190610ced565b9050600061046c670de0b6b3a764000083610ced565b905084811c6000610485670de0b6b3a764000084610cd6565b61048f9085610d0f565b90506000670de0b6b3a76400006104a98362010000610cd6565b6104b39190610ced565b905060006104c182856108bd565b9998505050505050505050565b600061051661042186868080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508892508791506107fa9050565b95945050505050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f01ffc9a700000000000000000000000000000000000000000000000000000000148061026757507fffffffff0000000000000000000000000000000000000000000000000000000082167f50e9a715000000000000000000000000000000000000000000000000000000001492915050565b8051600090819081905b8082101561073d5760008583815181106105dd576105dd610d22565b01602001516001600160f81b03191690507f800000000000000000000000000000000000000000000000000000000000000081101561062857610621600184610d38565b925061072a565b7fe0000000000000000000000000000000000000000000000000000000000000006001600160f81b03198216101561066557610621600284610d38565b7ff0000000000000000000000000000000000000000000000000000000000000006001600160f81b0319821610156106a257610621600384610d38565b7ff8000000000000000000000000000000000000000000000000000000000000006001600160f81b0319821610156106df57610621600484610d38565b7ffc000000000000000000000000000000000000000000000000000000000000006001600160f81b03198216101561071c57610621600584610d38565b610727600684610d38565b92505b508261073581610d4b565b9350506105c1565b50909392505050565b6000807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156107b4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107d89190610d64565b9050806107e9846305f5e100610cd6565b6107f39190610ced565b9392505050565b60006108096276a70084610d38565b92504283111561081b575060006107f3565b60006108278442610d0f565b905060006108557f000000000000000000000000000000000000000000000000000000000000000083610433565b90507f000000000000000000000000000000000000000000000000000000000000000081106108b1576108a87f000000000000000000000000000000000000000000000000000000000000000082610d0f565b925050506107f3565b50600095945050505050565b600060018316156108f057670de0b6b3a76400006108e3670de0ad151d09418084610cd6565b6108ed9190610ced565b91505b600283161561092157670de0b6b3a7640000610914670de0a3769959680084610cd6565b61091e9190610ced565b91505b600483161561095257670de0b6b3a7640000610945670de09039a5fa510084610cd6565b61094f9190610ced565b91505b600883161561098357670de0b6b3a7640000610976670de069c00f3e120084610cd6565b6109809190610ced565b91505b60108316156109b457670de0b6b3a76400006109a7670de01cce21c9440084610cd6565b6109b19190610ced565b91505b60208316156109e557670de0b6b3a76400006109d8670ddf82ef46ce100084610cd6565b6109e29190610ced565b91505b6040831615610a1657670de0b6b3a7640000610a09670dde4f458f8e8d8084610cd6565b610a139190610ced565b91505b6080831615610a4757670de0b6b3a7640000610a3a670ddbe84213d5f08084610cd6565b610a449190610ced565b91505b610100831615610a7957670de0b6b3a7640000610a6c670dd71b7aa6df5b8084610cd6565b610a769190610ced565b91505b610200831615610aab57670de0b6b3a7640000610a9e670dcd86e7f28cde0084610cd6565b610aa89190610ced565b91505b610400831615610add57670de0b6b3a7640000610ad0670dba71a3084ad68084610cd6565b610ada9190610ced565b91505b610800831615610b0f57670de0b6b3a7640000610b02670d94961b13dbde8084610cd6565b610b0c9190610ced565b91505b611000831615610b4157670de0b6b3a7640000610b34670d4a171c35c9838084610cd6565b610b3e9190610ced565b91505b612000831615610b7357670de0b6b3a7640000610b66670cb9da519ccfb70084610cd6565b610b709190610ced565b91505b614000831615610ba557670de0b6b3a7640000610b98670bab76d59c18d68084610cd6565b610ba29190610ced565b91505b618000831615610bd757670de0b6b3a7640000610bca6709d025defee4df8084610cd6565b610bd49190610ced565b91505b50919050565b600060208284031215610bef57600080fd5b81357fffffffff00000000000000000000000000000000000000000000000000000000811681146107f357600080fd5b60008060008060608587031215610c3557600080fd5b843567ffffffffffffffff80821115610c4d57600080fd5b818701915087601f830112610c6157600080fd5b813581811115610c7057600080fd5b886020828501011115610c8257600080fd5b6020928301999098509187013596604001359550909350505050565b60008060408385031215610cb157600080fd5b50508035926020909101359150565b634e487b7160e01b600052601160045260246000fd5b808202811582820484141761026757610267610cc0565b600082610d0a57634e487b7160e01b600052601260045260246000fd5b500490565b8181038181111561026757610267610cc0565b634e487b7160e01b600052603260045260246000fd5b8082018082111561026757610267610cc0565b600060018201610d5d57610d5d610cc0565b5060010190565b600060208284031215610d7657600080fd5b505191905056fea2646970667358221220c4620aa5e9ca76c66f1c05716b616b1233fbc3b45326a83d5b156050149c9e7664736f6c63430008110033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100be5760003560e01c8063a200e15311610076578063c8a4271f1161005b578063c8a4271f146101c2578063cd5d2c741461020e578063d820ed421461023557600080fd5b8063a200e15314610188578063a34e3596146101af57600080fd5b806350e9a715116100a757806350e9a7151461012057806359b6b86c1461014e57806359e1777c1461017557600080fd5b806301ffc9a7146100c35780632c0fd74c146100eb575b600080fd5b6100d66100d1366004610bdd565b61025c565b60405190151581526020015b60405180910390f35b6101127f000000000000000000000000000000000000000000000000000000000000000081565b6040519081526020016100e2565b61013361012e366004610c1f565b61026d565b604080518251815260209283015192810192909252016100e2565b6101127f000000000000000000000000000000000000000000000000000000000000000081565b610112610183366004610c9e565b610433565b6101127f000000000000000000000000000000000000000000000000000000000000000081565b6101126101bd366004610c1f565b6104ce565b6101e97f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100e2565b6101127f000000000000000000000000000000000000000000000000000000000000000081565b6101127f000000000000000000000000000000000000000000000000000000000000000081565b60006102678261051f565b92915050565b604080518082019091526000808252602082015260006102c286868080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506105b792505050565b90506000600582106102ff576102f8847f0000000000000000000000000000000000000000000000000000000000000000610cd6565b90506103c2565b81600403610331576102f8847f0000000000000000000000000000000000000000000000000000000000000000610cd6565b81600303610363576102f8847f0000000000000000000000000000000000000000000000000000000000000000610cd6565b81600203610395576102f8847f0000000000000000000000000000000000000000000000000000000000000000610cd6565b6103bf847f0000000000000000000000000000000000000000000000000000000000000000610cd6565b90505b60405180604001604052806103d683610746565b81526020016104266104218a8a8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508c92508b91506107fa9050565b610746565b9052979650505050505050565b6000806201518061044c670de0b6b3a764000085610cd6565b6104569190610ced565b9050600061046c670de0b6b3a764000083610ced565b905084811c6000610485670de0b6b3a764000084610cd6565b61048f9085610d0f565b90506000670de0b6b3a76400006104a98362010000610cd6565b6104b39190610ced565b905060006104c182856108bd565b9998505050505050505050565b600061051661042186868080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508892508791506107fa9050565b95945050505050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f01ffc9a700000000000000000000000000000000000000000000000000000000148061026757507fffffffff0000000000000000000000000000000000000000000000000000000082167f50e9a715000000000000000000000000000000000000000000000000000000001492915050565b8051600090819081905b8082101561073d5760008583815181106105dd576105dd610d22565b01602001516001600160f81b03191690507f800000000000000000000000000000000000000000000000000000000000000081101561062857610621600184610d38565b925061072a565b7fe0000000000000000000000000000000000000000000000000000000000000006001600160f81b03198216101561066557610621600284610d38565b7ff0000000000000000000000000000000000000000000000000000000000000006001600160f81b0319821610156106a257610621600384610d38565b7ff8000000000000000000000000000000000000000000000000000000000000006001600160f81b0319821610156106df57610621600484610d38565b7ffc000000000000000000000000000000000000000000000000000000000000006001600160f81b03198216101561071c57610621600584610d38565b610727600684610d38565b92505b508261073581610d4b565b9350506105c1565b50909392505050565b6000807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156107b4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107d89190610d64565b9050806107e9846305f5e100610cd6565b6107f39190610ced565b9392505050565b60006108096276a70084610d38565b92504283111561081b575060006107f3565b60006108278442610d0f565b905060006108557f000000000000000000000000000000000000000000000000000000000000000083610433565b90507f000000000000000000000000000000000000000000000000000000000000000081106108b1576108a87f000000000000000000000000000000000000000000000000000000000000000082610d0f565b925050506107f3565b50600095945050505050565b600060018316156108f057670de0b6b3a76400006108e3670de0ad151d09418084610cd6565b6108ed9190610ced565b91505b600283161561092157670de0b6b3a7640000610914670de0a3769959680084610cd6565b61091e9190610ced565b91505b600483161561095257670de0b6b3a7640000610945670de09039a5fa510084610cd6565b61094f9190610ced565b91505b600883161561098357670de0b6b3a7640000610976670de069c00f3e120084610cd6565b6109809190610ced565b91505b60108316156109b457670de0b6b3a76400006109a7670de01cce21c9440084610cd6565b6109b19190610ced565b91505b60208316156109e557670de0b6b3a76400006109d8670ddf82ef46ce100084610cd6565b6109e29190610ced565b91505b6040831615610a1657670de0b6b3a7640000610a09670dde4f458f8e8d8084610cd6565b610a139190610ced565b91505b6080831615610a4757670de0b6b3a7640000610a3a670ddbe84213d5f08084610cd6565b610a449190610ced565b91505b610100831615610a7957670de0b6b3a7640000610a6c670dd71b7aa6df5b8084610cd6565b610a769190610ced565b91505b610200831615610aab57670de0b6b3a7640000610a9e670dcd86e7f28cde0084610cd6565b610aa89190610ced565b91505b610400831615610add57670de0b6b3a7640000610ad0670dba71a3084ad68084610cd6565b610ada9190610ced565b91505b610800831615610b0f57670de0b6b3a7640000610b02670d94961b13dbde8084610cd6565b610b0c9190610ced565b91505b611000831615610b4157670de0b6b3a7640000610b34670d4a171c35c9838084610cd6565b610b3e9190610ced565b91505b612000831615610b7357670de0b6b3a7640000610b66670cb9da519ccfb70084610cd6565b610b709190610ced565b91505b614000831615610ba557670de0b6b3a7640000610b98670bab76d59c18d68084610cd6565b610ba29190610ced565b91505b618000831615610bd757670de0b6b3a7640000610bca6709d025defee4df8084610cd6565b610bd49190610ced565b91505b50919050565b600060208284031215610bef57600080fd5b81357fffffffff00000000000000000000000000000000000000000000000000000000811681146107f357600080fd5b60008060008060608587031215610c3557600080fd5b843567ffffffffffffffff80821115610c4d57600080fd5b818701915087601f830112610c6157600080fd5b813581811115610c7057600080fd5b886020828501011115610c8257600080fd5b6020928301999098509187013596604001359550909350505050565b60008060408385031215610cb157600080fd5b50508035926020909101359150565b634e487b7160e01b600052601160045260246000fd5b808202811582820484141761026757610267610cc0565b600082610d0a57634e487b7160e01b600052601260045260246000fd5b500490565b8181038181111561026757610267610cc0565b634e487b7160e01b600052603260045260246000fd5b8082018082111561026757610267610cc0565b600060018201610d5d57610d5d610cc0565b5060010190565b600060208284031215610d7657600080fd5b505191905056fea2646970667358221220c4620aa5e9ca76c66f1c05716b616b1233fbc3b45326a83d5b156050149c9e7664736f6c63430008110033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "ExponentialPremiumPriceOracle",
    constructorArgs: [_usdOracle: AbiParameterToPrimitiveType<{"name":"_usdOracle","type":"address"}>, _rentPrices: AbiParameterToPrimitiveType<{"name":"_rentPrices","type":"uint256[]"}>, _startPremium: AbiParameterToPrimitiveType<{"name":"_startPremium","type":"uint256"}>, totalDays: AbiParameterToPrimitiveType<{"name":"totalDays","type":"uint256"}>],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<ExponentialPremiumPriceOracle$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/ethregistrar/ExponentialPremiumPriceOracle.sol:ExponentialPremiumPriceOracle",
    constructorArgs: [_usdOracle: AbiParameterToPrimitiveType<{"name":"_usdOracle","type":"address"}>, _rentPrices: AbiParameterToPrimitiveType<{"name":"_rentPrices","type":"uint256[]"}>, _startPremium: AbiParameterToPrimitiveType<{"name":"_startPremium","type":"uint256"}>, totalDays: AbiParameterToPrimitiveType<{"name":"totalDays","type":"uint256"}>],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<ExponentialPremiumPriceOracle$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "ExponentialPremiumPriceOracle",
    constructorArgs: [_usdOracle: AbiParameterToPrimitiveType<{"name":"_usdOracle","type":"address"}>, _rentPrices: AbiParameterToPrimitiveType<{"name":"_rentPrices","type":"uint256[]"}>, _startPremium: AbiParameterToPrimitiveType<{"name":"_startPremium","type":"uint256"}>, totalDays: AbiParameterToPrimitiveType<{"name":"totalDays","type":"uint256"}>],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<ExponentialPremiumPriceOracle$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/ethregistrar/ExponentialPremiumPriceOracle.sol:ExponentialPremiumPriceOracle",
    constructorArgs: [_usdOracle: AbiParameterToPrimitiveType<{"name":"_usdOracle","type":"address"}>, _rentPrices: AbiParameterToPrimitiveType<{"name":"_rentPrices","type":"uint256[]"}>, _startPremium: AbiParameterToPrimitiveType<{"name":"_startPremium","type":"uint256"}>, totalDays: AbiParameterToPrimitiveType<{"name":"totalDays","type":"uint256"}>],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<ExponentialPremiumPriceOracle$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "ExponentialPremiumPriceOracle",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<ExponentialPremiumPriceOracle$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/ethregistrar/ExponentialPremiumPriceOracle.sol:ExponentialPremiumPriceOracle",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<ExponentialPremiumPriceOracle$Type["abi"]>>;
}
