import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useEnsAddress, useEnsName } from "wagmi";

interface POAPEvent {
  event: {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    city: string;
  };
  tokenId: string;
  owner: string;
  chain: string;
  created: string;
}

const API_BASE_URL = "/api/mockPoapApi";

const EventAttendanceVerification: React.FC<{ onVerified: () => void }> = ({ onVerified }) => {
  const [inputAddress, setInputAddress] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [poaps, setPOAPs] = useState<POAPEvent[]>([]);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  const { data: ensAddress } = useEnsAddress({
    name: inputAddress,
  });

  const fetchPOAPs = async (address: string) => {
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}?address=${address}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch POAPs: ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No POAPs found for this address');
      }
      const ethGlobalPOAPs = data.filter(
        (poap: POAPEvent) =>
          poap.event.name.toLowerCase().includes("ethglobal") &&
          poap.event.city.toLowerCase() === "brussels"
      );
      setPOAPs(ethGlobalPOAPs);
      if (ethGlobalPOAPs.length === 0) {
        setVerificationResult("No eligible POAPs found for ETHGlobal events in Brussels.");
      }
    } catch (error) {
      console.error("Error fetching POAPs:", error);
      setVerificationResult(error instanceof Error ? error.message : "Failed to verify POAPs. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerify = () => {
    if (poaps.length > 0) {
      setVerificationResult(
        `Verification successful! ${inputAddress} has attended an ETHGlobal event in Brussels.`,
      );
      onVerified();
    } else {
      setVerificationResult(
        `Verification failed. No eligible POAPs found for ${inputAddress} at ETHGlobal events in Brussels.`,
      );
    }
  };

  const handleImageError = (tokenId: string) => {
    setImageLoadErrors(prev => ({ ...prev, [tokenId]: true }));
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Event Attendance Verification</h2>
      <p className="mb-4">Enter your Ethereum address or ENS name to verify your attendance at an ETHGlobal event in Brussels:</p>
      <input
        type="text"
        value={inputAddress}
        onChange={(e) => setInputAddress(e.target.value)}
        placeholder="Enter Ethereum address or ENS name"
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => fetchPOAPs(ensAddress || inputAddress)}
          disabled={!inputAddress || isVerifying}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 flex-1"
        >
          Fetch POAPs
        </button>
        <button
          onClick={handleVerify}
          disabled={isVerifying || poaps.length === 0}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-300 flex-1"
        >
          Verify Attendance
        </button>
      </div>
      {isVerifying ? (
        <p>Verifying POAPs for {ensAddress || inputAddress}...</p>
      ) : (
        <>
          {poaps.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Eligible POAPs:</h3>
              <ul className="list-none pl-0">
                {poaps.map(poap => (
                  <li key={poap.tokenId} className="flex items-center mb-2">
                    {!imageLoadErrors[poap.tokenId] ? (
                      <Image
                        src={`https://api.poap.tech/token/${poap.tokenId}/image`}
                        alt={poap.event.name}
                        width={48}
                        height={48}
                        className="mr-2 rounded"
                        onError={() => handleImageError(poap.tokenId)}
                      />
                    ) : (
                      <div className="w-12 h-12 mr-2 rounded bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{poap.event.name}</p>
                      <p className="text-sm text-gray-600">{new Date(poap.event.start_date).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      {verificationResult && (
        <p className={`mt-4 ${verificationResult.includes("successful") ? "text-green-500" : "text-red-500"}`}>
          {verificationResult}
        </p>
      )}
    </div>
  );
};

export default EventAttendanceVerification;
