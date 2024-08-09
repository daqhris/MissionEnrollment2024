// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { NameEncoder$Type } from "./NameEncoder";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["NameEncoder"]: NameEncoder$Type;
    ["contracts/utils/NameEncoder.sol:NameEncoder"]: NameEncoder$Type;
  }

  interface ContractTypesMap {
    ["NameEncoder"]: GetContractReturnType<NameEncoder$Type["abi"]>;
    ["contracts/utils/NameEncoder.sol:NameEncoder"]: GetContractReturnType<NameEncoder$Type["abi"]>;
  }
}
