import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount } from 'wagmi';

interface Poap {
  event: {
    name: string;
    description: string;
  };
  imageUrl: string;
}

// Removed EventAttendanceProofProps as it's no longer needed

const EventAttendanceProof: React.FC = () => {
  const { address } = useAccount();
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoaps = async () => {
      if (!address) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/fetchPoaps?address=${address}`);
        setPoaps(response.data.poaps);
      } catch (err) {
        setError('Failed to fetch POAPs. Please try again later.');
        console.error('Error fetching POAPs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoaps();
  }, [address]);

  if (loading) return <p>Loading POAPs...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="event-attendance-proof">
      <h2>Event Attendance Proof</h2>
      {poaps.length === 0 ? (
        <p>No POAPs found for this event.</p>
      ) : (
        <ul>
          {poaps.map((poap, index) => (
            <li key={index}>
              <h3>{poap.event.name}</h3>
              <p>{poap.event.description}</p>
              <img src={poap.imageUrl} alt={`POAP for ${poap.event.name}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventAttendanceProof;
