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
        const etherscanApiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
        if (!etherscanApiKey) {
          throw new Error("Etherscan API key is not available. Please check your environment variables.");
        }

        // Construct Etherscan API URL to fetch POAP token transfers for the user
        const etherscanApiUrl = `https://api.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${POAP_CONTRACT_ADDRESS}&address=${userAddress}&sort=desc&apikey=${etherscanApiKey}`;

        const response = await axios.get(etherscanApiUrl);
        if (response.data.status !== "1") {
          throw new Error(`Etherscan API error: ${response.data.message}`);
        }

        const fetchedPoaps: POAPEvent[] = [];

        for (const tx of response.data.result) {
          try {
            const tokenId = tx.tokenID;
            const tokenURI = `https://api.poap.xyz/metadata/${tokenId}`;

            const metadataResponse = await axios.get(tokenURI);
            const metadata = metadataResponse.data;

            fetchedPoaps.push({
              event: {
                id: tokenId,
                name: metadata.name || "Unknown Event",
                image_url: metadata.image_url || "",
                start_date: metadata.start_date || '',
              },
              token_id: tokenId,
            });
          } catch (tokenError) {
            console.warn(`Failed to fetch token data for tokenID ${tx.tokenID}:`, tokenError);
            continue;
          }
        }

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
