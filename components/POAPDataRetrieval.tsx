import React, { useState, useEffect } from 'react';
import axios from 'axios';

const POAP_CONTRACT_ADDRESS = '0x22C1f6050E56d2876009903609a2cC3fEf83B415';

interface POAPEvent {
  event: {
    id: string;
    name: string;
    image_url: string;
    start_date: string;
  };
  token_id: string;
}

interface POAPDataRetrievalProps {
  userAddress: string;
}

const POAPDataRetrieval: React.FC<POAPDataRetrievalProps> = ({ userAddress }) => {
  const [poaps, setPoaps] = useState<POAPEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPOAPs = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const poapApiKey = process.env.NEXT_PUBLIC_POAP_API_KEY;
        if (!poapApiKey) {
          throw new Error("POAP API key is not available. Please check your environment variables.");
        }

        // Construct POAP API URL to fetch POAPs for the user
        const poapApiUrl = `https://api.poap.xyz/actions/scan/${userAddress}`;

        const response = await axios.get(poapApiUrl, {
          headers: {
            'X-API-Key': poapApiKey
          }
        });

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error(`POAP API error: Invalid response format`);
        }

        const fetchedPoaps: POAPEvent[] = response.data.map((poap: any) => ({
          event: {
            id: poap.event.id,
            name: poap.event.name || "Unknown Event",
            image_url: poap.event.image_url || "",
            start_date: poap.event.start_date || '',
          },
          token_id: poap.tokenId,
        }));

        setPoaps(fetchedPoaps);
      } catch (err) {
        console.error("Error fetching POAP data:", err);
        setError(`An error occurred while fetching POAP data: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (userAddress) {
      fetchPOAPs();
    }
  }, [userAddress]);

  return (
    <div>
      {isLoading && <p>Loading POAPs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {poaps.length > 0 && (
        <div>
          <h3>Your POAPs:</h3>
          <ul>
            {poaps.map((poap) => (
              <li key={poap.token_id}>
                {poap.event.name} - Date: {poap.event.start_date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default POAPDataRetrieval;
