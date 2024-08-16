import React, { useEffect, useState } from "react";
import axios from "axios";

interface Poap {
  event: {
    name: string;
    description: string;
  };
  imageUrl: string;
}

interface EventAttendanceProofProps {
  onVerified: () => void;
  setPoaps: (poaps: Poap[]) => void;
  userAddress: string | undefined;
}

const EventAttendanceProof: React.FC<EventAttendanceProofProps> = ({ onVerified, setPoaps, userAddress }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoaps = async () => {
      if (!userAddress) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/fetchPoaps?address=${userAddress}`);
        const fetchedPoaps = response.data.poaps;
        setPoaps(fetchedPoaps);
        if (fetchedPoaps.length > 0) {
          onVerified();
        } else {
          setError("No ETHGlobal Brussels 2024 POAP found for this address.");
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(`Failed to fetch POAPs: ${err.response.data.error}`);
        } else {
          setError("Failed to fetch POAPs. Please try again later.");
        }
        console.error("Error fetching POAPs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoaps();
  }, [userAddress, onVerified, setPoaps]);

  if (loading) return <p className="text-center">Loading POAPs...</p>;
  if (error) return <p className="error text-center text-red-500">{error}</p>;

  return (
    <div className="event-attendance-proof text-center">
      <h2 className="text-2xl font-bold mb-4">Event Attendance Proof</h2>
      <p>Checking for ETHGlobal Brussels 2024 POAP...</p>
    </div>
  );
};

export default EventAttendanceProof;
