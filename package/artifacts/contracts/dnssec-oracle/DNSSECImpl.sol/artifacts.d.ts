// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { DNSSECImpl$Type } from "./DNSSECImpl";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["DNSSECImpl"]: DNSSECImpl$Type;
    ["contracts/dnssec-oracle/DNSSECImpl.sol:DNSSECImpl"]: DNSSECImpl$Type;
  }

  interface ContractTypesMap {
    ["DNSSECImpl"]: GetContractReturnType<DNSSECImpl$Type["abi"]>;
    ["contracts/dnssec-oracle/DNSSECImpl.sol:DNSSECImpl"]: GetContractReturnType<DNSSECImpl$Type["abi"]>;
  }
}
