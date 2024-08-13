import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import eventIdsData from "../event_ids.json";
import axios from "axios";

const { eventIds } = eventIdsData;

interface POAPEvent {
  event: {
    id: string;
    name: string;
    image_url: string;
    start_date: string;
  };
  tokenId: string;
}

const EventAttendanceProof: React.FC<{
  onVerified: () => void;
  setPoaps: React.Dispatch<React.SetStateAction<POAPEvent[]>>;
  userAddress: string;
}> = ({ onVerified, setPoaps, userAddress }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [proofResult, setProofResult] = useState<string | null>(null);
  const [localPoaps, setLocalPoaps] = useState<POAPEvent[]>([]);
  const [missingPoaps, setMissingPoaps] = useState<string[]>([]);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  // ENS resolution is no longer needed as we're using the provided userAddress

  const fetchPOAPs = useCallback(async () => {
    setIsVerifying(true);
    setProofResult(null);
    setLocalPoaps([]);
    setMissingPoaps([]);

    try {
      console.log(`Fetching POAPs for address: ${userAddress}`);
      const response = await axios.get(`/api/fetchPoaps?address=${encodeURIComponent(userAddress)}`);
      console.log("API response:", JSON.stringify(response.data, null, 2));

      const { poaps = [], message = "" } = response.data;

      // Ensure poaps is always an array
      const validPoaps = Array.isArray(poaps) ? poaps : [];
      setLocalPoaps(validPoaps);
      setPoaps(validPoaps);

      // Set missing POAPs based on the difference between all event IDs and found POAPs
      const foundEventIds = validPoaps.map(poap => poap.event.id);
      const missingEventIds = eventIds.filter(id => !foundEventIds.includes(id));
      setMissingPoaps(missingEventIds);

      if (validPoaps.length === eventIds.length) {
        setProofResult(`Proof successful! ${userAddress} has all required POAPs for ETHGlobal Brussels 2024.`);
        onVerified();
      } else if (validPoaps.length > 0) {
        setProofResult(`${userAddress} has ${validPoaps.length} out of ${eventIds.length} required POAPs for ETHGlobal Brussels 2024.`);
      } else {
        setProofResult(message || "No required POAPs were found for this address.");
      }
    } catch (error) {
      console.error("Error fetching POAP data:", error);
      setLocalPoaps([]);
      setMissingPoaps(eventIds);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setProofResult(error.response.data.error || "Invalid input. Please check your address and try again.");
        } else if (error.response?.status === 404) {
          setProofResult("No POAPs found for this address. Make sure you've attended ETHGlobal Brussels 2024.");
        } else if (error.response?.status === 500) {
          setProofResult("Server error. Please try again later or contact support if the issue persists.");
        } else {
          setProofResult("Network error. Please check your internet connection and try again.");
        }
      } else {
        setProofResult("An unexpected error occurred. Please try again or contact support.");
      }
    } finally {
      setIsVerifying(false);
    }
  }, [onVerified, userAddress, setPoaps, eventIds]);

  useEffect(() => {
    if (userAddress) {
      fetchPOAPs();
    }
  }, [userAddress, fetchPOAPs]);

  const handleImageError = (tokenId: string) => {
    setImageLoadErrors(prev => ({ ...prev, [tokenId]: true }));
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Event Attendance Proof</h2>
      <p className="mb-4">Verifying your attendance at ETHGlobal Brussels 2024:</p>
      <button
        onClick={() => fetchPOAPs()}
        disabled={isVerifying}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 mb-4"
      >
        {isVerifying ? "Verifying..." : "Verify Attendance"}
      </button>
      {isVerifying && <p className="text-blue-500 mb-4">Verifying attendance for {userAddress}...</p>}
      {localPoaps && localPoaps.length > 0 && (
        <div className="mt-4 bg-green-100 p-4 rounded">
          <h3 className="text-lg font-semibold text-green-800 mb-2">POAPs Found</h3>
          <p className="text-green-700 mb-4">
            {localPoaps.length === eventIds.length
              ? "You have all required POAPs for ETHGlobal Brussels 2024."
              : `You have ${localPoaps.length} out of ${eventIds.length} required POAPs for ETHGlobal Brussels 2024.`}
          </p>
          <div className="flex flex-wrap">
            {localPoaps.map(poap => (
              <div key={poap.tokenId} className="mr-4 mb-4">
                <Image
                  src={imageLoadErrors[poap.tokenId] ? "/placeholder-poap.png" : poap.event?.image_url || "/placeholder-poap.png"}
                  alt={poap.event?.name || "POAP"}
                  width={64}
                  height={64}
                  className="rounded-full"
                  onError={() => handleImageError(poap.tokenId)}
                />
                <p className="text-sm text-center mt-1">{poap.event?.name || "Unknown Event"}</p>
                <p className="text-xs text-center text-gray-600">
                  {poap.event?.start_date
                    ? new Date(poap.event.start_date).toLocaleDateString()
                    : "Date unknown"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {missingPoaps && missingPoaps.length > 0 && (
        <div className="mt-4 bg-yellow-100 p-4 rounded">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Missing POAPs</h3>
          <p className="text-yellow-700 mb-2">
            The following POAPs were not found for your address: {missingPoaps.join(", ")}
          </p>
        </div>
      )}
      {proofResult && (
        <div className={`mt-4 p-4 rounded ${proofResult.includes("successful") ? "bg-green-100" : "bg-red-100"}`}>
          <p className={proofResult.includes("successful") ? "text-green-700" : "text-red-700"}>{proofResult}</p>
        </div>
      )}
    </div>
  );
};

export default EventAttendanceProof;
