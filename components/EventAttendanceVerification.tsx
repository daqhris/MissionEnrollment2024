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
  token_id: string;
}

interface EventAttendanceProofProps {
  onVerified: () => void;
  setPoaps: (poaps: POAPEvent[]) => void;
  userAddress: string;
}

const EventAttendanceProof: React.FC<EventAttendanceProofProps> = ({ onVerified, setPoaps, userAddress }) => {
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

    const maxRetries = 5;
    let retries = 0;

    const fetchWithRetry = async () => {
      try {
        console.log(`Fetching POAPs for address: ${userAddress} (Attempt ${retries + 1})`);
        const response = await axios.get(`/api/fetchPoaps?address=${encodeURIComponent(userAddress)}`);
        console.log("API response:", JSON.stringify(response.data, null, 2));

        const { poaps = [], message = "" } = response.data;

        // Ensure poaps is always an array
        const validPoaps = Array.isArray(poaps) ? poaps : [];

        // Filter POAPs for ETHGlobal Brussels 2024
        const filteredPoaps = validPoaps.filter(poap => {
          const eventDate = new Date(poap.event.start_date);
          return poap.event.name.toLowerCase().includes("ethglobal brussels") &&
                 eventDate.getFullYear() === 2024 &&
                 eventDate >= new Date('2024-07-11') &&
                 eventDate <= new Date('2024-07-14');
        });

        console.log("Filtered POAPs:", filteredPoaps);

        setLocalPoaps(filteredPoaps);
        setPoaps(filteredPoaps);

        // Set missing POAPs based on the difference between all event IDs and found POAPs
        const foundEventIds = filteredPoaps.map(poap => poap.event.id);
        const missingEventIds = eventIds.filter(id => !foundEventIds.includes(id));
        setMissingPoaps(missingEventIds);

        if (filteredPoaps.length > 0) {
          const requiredPoapCount = 1; // Only one POAP is required for ETHGlobal Brussels 2024
          if (filteredPoaps.length >= requiredPoapCount) {
            setProofResult(`Proof successful! ${userAddress} has the required POAP for ETHGlobal Brussels 2024.`);
            onVerified();
          } else {
            setProofResult(
              `${userAddress} has a POAP from ETHGlobal Brussels 2024, but it may not be the specific required one. Please check with the event organizers.`
            );
          }
        } else {
          setProofResult("No POAPs from ETHGlobal Brussels 2024 were found for this address.");
        }

        return true; // Success
      } catch (error) {
        console.error(`Error fetching POAP data (Attempt ${retries + 1}):`, error);

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          switch (status) {
            case 400:
              setProofResult("Invalid input. Please check your address and try again.");
              return false; // Don't retry on bad request
            case 401:
              setProofResult("Unauthorized. Please check your API key configuration.");
              return false; // Don't retry on unauthorized
            case 404:
              setProofResult("No POAPs found for this address. Make sure you've attended ETHGlobal Brussels 2024.");
              return false; // Don't retry on not found
            case 429:
              // Implement specific handling for rate limiting
              const retryAfter = parseInt(error.response?.headers['retry-after'] || '60', 10);
              setProofResult(`Rate limit exceeded. Retrying in ${retryAfter} seconds...`);
              await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
              return null; // Retry after waiting
            default:
              if (status && status >= 500) {
                setProofResult("Server error. Retrying...");
                return null; // Retry on server errors
              } else {
                setProofResult("Network error. Retrying...");
                return null; // Retry on network errors
              }
          }
        } else {
          setProofResult("An unexpected error occurred. Retrying...");
          return null; // Retry on unexpected errors
        }
      }
    };

    while (retries < maxRetries) {
      const result = await fetchWithRetry();
      if (result === true) break; // Success
      if (result === false) return; // Don't retry

      retries++;
      if (retries >= maxRetries) {
        setProofResult("Failed to fetch POAPs after multiple attempts. Please try again later.");
        setLocalPoaps([]);
        setMissingPoaps(eventIds);
        return;
      }

      // Provide user feedback before retrying
      setProofResult(`Retrying... Attempt ${retries + 1} of ${maxRetries}`);

      // Implement exponential backoff with jitter
      const baseDelay = 1000 * Math.pow(2, retries);
      const jitter = Math.random() * 1000;
      const delay = Math.min(baseDelay + jitter, 30000); // Cap at 30 seconds
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setIsVerifying(false);
  }, [onVerified, userAddress, setPoaps]);

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
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-300 mb-4"
      >
        {isVerifying ? "Verifying..." : "Verify Attendance"}
      </button>
      {isVerifying && <p className="text-blue-700 mb-4">Verifying attendance for {userAddress}...</p>}
      {localPoaps && localPoaps.length > 0 && (
        <div className="mt-4 bg-green-100 p-4 rounded">
          <h3 className="text-lg font-semibold text-green-900 mb-2">POAPs Found</h3>
          <p className="text-green-800 mb-4">
            {localPoaps.length === eventIds.length
              ? "You have all required POAPs for ETHGlobal Brussels 2024."
              : `You have ${localPoaps.length} out of ${eventIds.length} required POAPs for ETHGlobal Brussels 2024.`}
          </p>
          <div className="flex flex-wrap">
            {localPoaps.map(poap => (
              <div key={poap.token_id} className="mr-4 mb-4">
                <Image
                  src={
                    imageLoadErrors[poap.token_id]
                      ? "/placeholder-poap.png"
                      : poap.event?.image_url || "/placeholder-poap.png"
                  }
                  alt={poap.event?.name || "POAP"}
                  width={64}
                  height={64}
                  className="rounded-full"
                  onError={() => handleImageError(poap.token_id)}
                />
                <p className="text-sm text-center mt-1">{poap.event?.name || "Unknown Event"}</p>
                <p className="text-xs text-center text-gray-700">
                  {poap.event?.start_date ? new Date(poap.event.start_date).toLocaleDateString() : "Date unknown"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {missingPoaps && missingPoaps.length > 0 && (
        <div className="mt-4 bg-yellow-100 p-4 rounded">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Missing POAPs</h3>
          <p className="text-yellow-800 mb-2">
            The following POAPs were not found for your address: {missingPoaps.join(", ")}
          </p>
        </div>
      )}
      {proofResult && (
        <div className={`mt-4 p-4 rounded ${proofResult.includes("successful") ? "bg-green-100" : "bg-red-100"}`}>
          <p className={proofResult.includes("successful") ? "text-green-800" : "text-red-700"}>{proofResult}</p>
        </div>
      )}
    </div>
  );
};

export default EventAttendanceProof;
