export interface Attestation {
  id: string;
  attester: string;
  recipient: string;
  refUID: string;
  revocable: boolean;
  revocationTime: string;
  expirationTime: string;
  data: string;
}
