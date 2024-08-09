// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { IERC721Receiver$Type } from "./IERC721Receiver";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["IERC721Receiver"]: IERC721Receiver$Type;
    ["@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol:IERC721Receiver"]: IERC721Receiver$Type;
  }

  interface ContractTypesMap {
    ["IERC721Receiver"]: GetContractReturnType<IERC721Receiver$Type["abi"]>;
    ["@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol:IERC721Receiver"]: GetContractReturnType<IERC721Receiver$Type["abi"]>;
  }
}
