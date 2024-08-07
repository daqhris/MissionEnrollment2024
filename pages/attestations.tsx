import React from "react";
import { AttestationCard } from "../components/AttestationCard";
import { GET_ATTESTATIONS } from "../graphql/queries";
import { Attestation } from "../types/attestation";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";

const AttestationsPage: React.FC = () => {
  const { address } = useAccount();
  const { loading, error, data } = useQuery(GET_ATTESTATIONS, {
    variables: { address },
    skip: !address,
  });

  // Mock data for testing
  const mockAttestations: Attestation[] = [
    {
      id: "0x123456789abcdef",
      attester: "0xAttesterAddress",
      recipient: "0xRecipientAddress",
      refUID: "0xReferenceUID",
      revocable: true,
      revocationTime: "1234567890",
      expirationTime: "9876543210",
      data: "Sample attestation data",
    },
    // Add more mock attestations as needed
  ];

  if (loading) return <p className="text-center mt-8">Loading attestations...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error loading attestations: {error.message}</p>;

  const attestations: Attestation[] = data?.attestations || mockAttestations;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Public Attestations</h1>
      {attestations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attestations.map(attestation => (
            <AttestationCard key={attestation.id} attestation={attestation} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No attestations found.</p>
      )}
    </div>
  );
};

export default AttestationsPage;
