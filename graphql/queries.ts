import { gql } from '@apollo/client';

export const GET_ATTESTATIONS = gql`
  query GetAttestations($address: String!) {
    attestations(where: { recipient: $address }) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
    }
  }
`;
