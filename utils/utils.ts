import type { Attestation } from "../types/attestation";

// @ts-ignore
BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

const baseURL = "https://sepolia.easscan.org";

export async function submitSignedAttestation(pkg: Attestation): Promise<StoreIPFSActionReturn> {
  const data: StoreAttestationRequest = {
    filename: `eas.txt`,
    textJson: JSON.stringify(pkg),
  };

  const response = await fetch(`${baseURL}/offchain/store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json() as StoreIPFSActionReturn;
}

export type StoreAttestationRequest = { filename: string; textJson: string };

export type StoreIPFSActionReturn = {
  error: null | string;
  ipfsHash: string | null;
  offchainAttestationId: string | null;
};
