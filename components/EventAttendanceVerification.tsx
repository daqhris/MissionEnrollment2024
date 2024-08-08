import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useEnsAddress, useEnsName } from "wagmi";

interface POAPEvent {
  id: string;
  name: string;
  city: string;
  country: string;
  start_date: string;
  end_date: string;
  image_url: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_POAP_API_URL || "https://api.poap.tech";
const API_KEY = process.env.NEXT_PUBLIC_POAP_API_KEY;

if (!API_KEY) {
  console.warn("POAP API key is not set. Please set NEXT_PUBLIC_POAP_API_KEY in your environment.");
}

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
      const response = await fetch(`${API_BASE_URL}/actions/scan/${address}`, {
        headers: {
          "X-API-Key": API_KEY || "",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch POAPs: ${response.statusText}`);
      }
      const data = await response.json();
      const ethGlobalPOAPs = data.filter(
        (poap: POAPEvent) => poap.name.toLowerCase().includes("ethglobal") && poap.city.toLowerCase() === "brussels",
      );
      setPOAPs(ethGlobalPOAPs);
    } catch (error) {
      console.error("Error fetching POAPs:", error);
      setVerificationResult("Failed to verify POAPs. Please try again.");
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

  const handleImageError = (poapId: string) => {
    setImageLoadErrors(prev => ({ ...prev, [poapId]: true }));
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
      <button
        onClick={() => fetchPOAPs(ensAddress || inputAddress)}
        disabled={!inputAddress || isVerifying}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 mb-4"
      >
        Fetch POAPs
      </button>
      {isVerifying ? (
        <p>Verifying POAPs for {ensAddress || inputAddress}...</p>
      ) : (
        <>
          {poaps.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Eligible POAPs:</h3>
              <ul className="list-none pl-0">
                {poaps.map(poap => (
                  <li key={poap.id} className="flex items-center mb-2">
                    {!imageLoadErrors[poap.id] ? (
                      <Image
                        src={poap.image_url}
                        alt={poap.name}
                        width={48}
                        height={48}
                        className="mr-2 rounded"
                        onError={() => handleImageError(poap.id)}
                      />
                    ) : (
                      <div className="w-12 h-12 mr-2 rounded bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{poap.name}</p>
                      <p className="text-sm text-gray-600">{new Date(poap.start_date).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleVerify}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-4"
              >
                Verify Attendance
              </button>
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
