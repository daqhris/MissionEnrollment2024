// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { NameResolver$Type } from "./NameResolver";
import { ReverseRegistrar$Type } from "./ReverseRegistrar";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["NameResolver"]: NameResolver$Type;
    ["ReverseRegistrar"]: ReverseRegistrar$Type;
    ["contracts/reverseRegistrar/ReverseRegistrar.sol:NameResolver"]: NameResolver$Type;
    ["contracts/reverseRegistrar/ReverseRegistrar.sol:ReverseRegistrar"]: ReverseRegistrar$Type;
  }

  interface ContractTypesMap {
    ["NameResolver"]: GetContractReturnType<NameResolver$Type["abi"]>;
    ["ReverseRegistrar"]: GetContractReturnType<ReverseRegistrar$Type["abi"]>;
    ["contracts/reverseRegistrar/ReverseRegistrar.sol:NameResolver"]: GetContractReturnType<NameResolver$Type["abi"]>;
    ["contracts/reverseRegistrar/ReverseRegistrar.sol:ReverseRegistrar"]: GetContractReturnType<ReverseRegistrar$Type["abi"]>;
  }
}
