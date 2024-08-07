import React, { useEffect, useState } from "react";
import { AttestationCard } from "../components/AttestationCard";
import { GET_ATTESTATIONS } from "../graphql/queries";
import { Attestation } from "../types/attestation";
import { useQuery } from "@apollo/client";

const BlockExplorer: React.FC = () => {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const { loading, error, data } = useQuery(GET_ATTESTATIONS, {
    variables: { first: pageSize, skip: (currentPage - 1) * pageSize, searchTerm },
  });

  useEffect(() => {
    if (data && data.attestations) {
      setAttestations(data.attestations);
    }
  }, [data]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) return <p className="text-center mt-8">Loading attestations...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error loading attestations: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Block Explorer</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search attestations..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      {attestations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attestations.map(attestation => (
            <AttestationCard key={attestation.id} attestation={attestation} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No attestations found.</p>
      )}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={attestations.length < pageSize}
          className="px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlockExplorer;
