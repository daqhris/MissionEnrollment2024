import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_RECENT_ATTESTATIONS } from "../graphql/queries";
import { AttestationCard } from "../components/AttestationCard";
import { Attestation } from "../types/attestation";

const RecentPage: React.FC = () => {
  const [recentAttestations, setRecentAttestations] = useState<Attestation[]>([]);
  const { loading, error, data } = useQuery(GET_RECENT_ATTESTATIONS, {
    variables: { limit: 10 }, // Fetch the 10 most recent attestations
  });

  useEffect(() => {
    if (data && data.attestations) {
      setRecentAttestations(data.attestations);
    }
  }, [data]);

  if (loading) return <p className="text-center mt-8">Loading recent activities...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error loading recent activities: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recent Activities</h1>
      {recentAttestations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentAttestations.map(attestation => (
            <AttestationCard key={attestation.id} attestation={attestation} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No recent activities found.</p>
      )}
    </div>
  );
};

export default RecentPage;
