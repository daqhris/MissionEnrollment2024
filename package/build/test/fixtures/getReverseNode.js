import { namehash } from "viem";

export const getReverseNode = address => `${address.slice(2)}.addr.reverse`;
export const getReverseNodeHash = address => namehash(getReverseNode(address));
