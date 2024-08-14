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

  const fetchPOAPs = useCallback(async () => {
    console.log("Starting fetchPOAPs function for address:", userAddress);
    setIsVerifying(true);
    setProofResult(null);
    setLocalPoaps([]);
    setMissingPoaps([]);

    try {
      console.log(`Fetching POAPs for address: ${userAddress}`);
      const response = await axios.get(`/api/fetchPoaps?address=${encodeURIComponent(userAddress)}`);
      console.log("API response:", JSON.stringify(response.data, null, 2));

      const { poaps = [] } = response.data;

      // Ensure poaps is always an array
      const validPoaps = Array.isArray(poaps) ? poaps : [];
      console.log("Valid POAPs:", JSON.stringify(validPoaps, null, 2));
      console.log("Setting localPoaps state...");
      setLocalPoaps(validPoaps);
      console.log("Setting poaps state via setPoaps prop...");
      setPoaps(validPoaps);

      // Set missing POAPs based on the difference between all event IDs and found POAPs
      const foundEventIds = validPoaps.map(poap => poap.event.id);
      const missingEventIds = eventIds.filter(id => !foundEventIds.includes(id));
      console.log("Missing Event IDs:", missingEventIds);
      console.log("Setting missingPoaps state...");
      setMissingPoaps(missingEventIds);

      if (validPoaps.length > 0) {
        if (validPoaps.length === eventIds.length) {
          const successMessage = `Proof successful! ${userAddress} has all required POAPs for ETHGlobal Brussels 2024.`;
          console.log(successMessage);
          console.log("Setting proofResult state (success)...");
          setProofResult(successMessage);
          console.log("Calling onVerified callback...");
          onVerified();
        } else {
          const partialMessage = `${userAddress} has ${validPoaps.length} out of ${eventIds.length} required POAPs for ETHGlobal Brussels 2024.`;
          console.log(partialMessage);
          console.log("Setting proofResult state (partial)...");
          setProofResult(partialMessage);
        }
      } else {
        const noPoapsMessage = "No required POAPs were found for this address.";
        console.log(noPoapsMessage);
        console.log("Setting proofResult state (no POAPs)...");
        setProofResult(noPoapsMessage);
      }
    } catch (error) {
      console.error("Error fetching POAP data:", error);
      console.log("Setting localPoaps state to empty array...");
      setLocalPoaps([]);
      console.log("Setting missingPoaps state to all eventIds...");
      setMissingPoaps(eventIds);
      if (axios.isAxiosError(error)) {
        console.log("Axios error details:", error.response?.data);
        let errorMessage: string;
        if (error.response?.status === 400) {
          errorMessage = error.response.data.error || "Invalid input. Please check your address and try again.";
        } else if (error.response?.status === 404) {
          errorMessage = "No POAPs found for this address. Make sure you've attended ETHGlobal Brussels 2024.";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later or contact support if the issue persists.";
        } else {
          errorMessage = `Network error (${error.response?.status}). Please check your internet connection and try again.`;
        }
        console.log("Setting proofResult state (error):", errorMessage);
        setProofResult(errorMessage);
      } else {
        console.log("Setting proofResult state (unexpected error)...");
        setProofResult("An unexpected error occurred. Please try again or contact support.");
      }
    } finally {
      console.log("Setting isVerifying state to false...");
      setIsVerifying(false);
      console.log("Finished fetchPOAPs function");
    }
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
        onClick={fetchPOAPs}
        disabled={isVerifying}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-300 mb-4"
      >
        {isVerifying ? "Verifying..." : "Verify Attendance"}
      </button>
      {isVerifying && (
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          <p className="text-blue-700 ml-2">Verifying attendance for {userAddress}...</p>
        </div>
      )}
      {!isVerifying && localPoaps.length > 0 && (
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
      {!isVerifying && missingPoaps.length > 0 && (
        <div className="mt-4 bg-yellow-100 p-4 rounded">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Missing POAPs</h3>
          <p className="text-yellow-800 mb-2">
            The following POAPs were not found for your address: {missingPoaps.join(", ")}
          </p>
        </div>
      )}
      {!isVerifying && proofResult && (
        <div className={`mt-4 p-4 rounded ${proofResult.includes("successful") ? "bg-green-100" : "bg-red-100"}`}>
          <p className={proofResult.includes("successful") ? "text-green-800" : "text-red-700"}>{proofResult}</p>
        </div>
      )}
      {!isVerifying && !proofResult && !localPoaps.length && (
        <div className="mt-4 p-4 rounded bg-blue-100">
          <p className="text-blue-800">No POAPs found. Please check your address and try again.</p>
        </div>
      )}
      {!isVerifying && proofResult && !proofResult.includes("successful") && (
        <button
          onClick={fetchPOAPs}
          className="mt-4 w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default EventAttendanceProof;
