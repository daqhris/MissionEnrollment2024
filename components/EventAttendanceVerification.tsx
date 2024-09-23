import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import eventIdsData from "../event_ids.json";
import { useEnsAddress } from "wagmi";
import { poapContract, safePoapContractCall, ethers } from "../config";

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

interface EventAttendanceVerificationProps {
  onVerified: () => void;
  setPoaps: (poaps: POAPEvent[]) => void;
  userAddress: string;
}

const EventAttendanceVerification: React.FC<EventAttendanceVerificationProps> = ({
  onVerified,
  setPoaps,
  userAddress,
}): JSX.Element => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [proofResult, setProofResult] = useState<string | null>(null);
  const [localPoaps, setLocalPoaps] = useState<POAPEvent[]>([]);
  const [missingPoaps, setMissingPoaps] = useState<string[]>([]);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  const [manualAddress, setManualAddress] = useState<string>("");

  const {
    data: resolvedAddress,
    isLoading: isResolvingENS,
    isError: ensResolutionError,
  } = useEnsAddress({
    name: manualAddress,
    chainId: 1, // Mainnet
  });

// Specific event ID for ETHGlobal Brussels 2024
const ETH_GLOBAL_BRUSSELS_2024_EVENT_ID = "141"; // Actual event ID for ETHGlobal Brussels 2024

const isEthGlobalBrusselsPOAP = (poap: POAPEvent): boolean => {
  // Primary check: Match the specific event ID
  if (poap.event.id === ETH_GLOBAL_BRUSSELS_2024_EVENT_ID) {
    return true;
  }

  // Secondary check: Use event details for verification
  const eventDate = new Date(poap.event.start_date);
  const eventName = poap.event.name.toLowerCase();

  const isCorrectName = eventName.includes("ethglobal") &&
                        eventName.includes("brussels") &&
                        eventName.includes("2024");
  const isCorrectYear = eventDate.getFullYear() === 2024;
  const isWithinEventDates = eventDate >= new Date("2024-07-11") &&
                             eventDate <= new Date("2024-07-14");

  return isCorrectName && isCorrectYear && isWithinEventDates;
};

const fetchPOAPs = useCallback(
  async (addressToFetch: string): Promise<void> => {
    console.log(`Starting POAP fetch for address: ${addressToFetch}`);
    setIsVerifying(true);
    setProofResult(null);
    setLocalPoaps([]);
    setMissingPoaps([]);

    try {
      console.log(`Initializing POAP contract for address: ${addressToFetch}`);
      if (!poapContract) {
        throw new Error("POAP contract is not initialized");
      }

      console.log(`Fetching POAP balance for address: ${addressToFetch}`);
      const balance = await safePoapContractCall<bigint>('balanceOf', addressToFetch);
      if (!balance || balance <= 0n) {
        throw new Error("Failed to fetch POAP balance or invalid balance type");
      }
      console.log(`POAP balance for ${addressToFetch}: ${balance.toString()}`);

      const poaps: POAPEvent[] = [];

      // Fetch POAP data for each token
      for (let i = 0; i < Number(balance); i++) {
        try {
          console.log(`Fetching token ID for ${addressToFetch} at index ${i}`);
          const tokenId = await safePoapContractCall<ethers.BigNumberish>('tokenOfOwnerByIndex', addressToFetch, i);
          if (!tokenId || ethers.getBigInt(tokenId) <= 0n) {
            console.error(`Failed to fetch token ID or invalid token ID type for ${addressToFetch} at index ${i}`);
            continue;
          }
          console.log(`Token ID for ${addressToFetch} at index ${i}: ${ethers.getBigInt(tokenId).toString()}`);

          console.log(`Fetching token URI for token ID ${tokenId}`);
          const tokenURI = await safePoapContractCall<string>('tokenURI', tokenId);
          if (!tokenURI) {
            console.error(`Failed to fetch token URI for token ID ${tokenId}`);
            continue;
          }
          console.log(`Token URI for token ID ${tokenId}: ${tokenURI}`);

          // Fetch metadata from IPFS
          console.log(`Fetching metadata from ${tokenURI}`);
          let response;
          try {
            response = await fetch(tokenURI);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          } catch (error) {
            console.error(`Error fetching metadata for token ID ${tokenId}:`, error);
            continue;
          }

          let metadata;
          try {
            metadata = await response.json();
          } catch (error) {
            console.error(`Error parsing metadata JSON for token ID ${tokenId}:`, error);
            continue;
          }
          console.log(`Metadata for token ID ${tokenId}:`, metadata);

          // Early filtering: Check if the POAP is from ETHGlobal Brussels 2024
          const poapEvent = {
            event: {
              id: tokenId.toString(),
              name: metadata.name || "Unknown Event",
              image_url: metadata.image || "",
              start_date: metadata.attributes?.find((attr: { trait_type: string; value: string }) => attr.trait_type === 'event_date')?.value || '',
            },
            token_id: tokenId.toString(),
          };

          if (isEthGlobalBrusselsPOAP(poapEvent)) {
            console.log(`Found ETHGlobal Brussels 2024 POAP: ${poapEvent.event.name}`);
            poaps.push(poapEvent);
          } else {
            console.log(`Skipping non-ETHGlobal Brussels 2024 POAP: ${poapEvent.event.name}`);
          }
        } catch (error) {
          console.error(`Error processing POAP data for token ${i}:`, error);
          // Continue to the next token if there's an error with the current one
          continue;
        }
      }

      console.log(`Total ETHGlobal Brussels 2024 POAPs fetched for ${addressToFetch}:`, poaps.length);

      console.log(`Setting local POAPs and updating state`);
      setLocalPoaps(poaps);
      setPoaps(poaps);

      const foundEventIds = poaps.map(poap => poap.event.id);
      const missingEventIds = eventIds.filter(id => !foundEventIds.includes(id));
      console.log(`Missing event IDs:`, missingEventIds);
      setMissingPoaps(missingEventIds);

      if (poaps.length > 0) {
        const requiredPoapCount = 1;
        const ethGlobalBrusselsPOAPs = poaps.filter(poap => poap.event.id === ETH_GLOBAL_BRUSSELS_2024_EVENT_ID);

        if (ethGlobalBrusselsPOAPs.length >= requiredPoapCount) {
          console.log(`Proof successful for ${addressToFetch}`);
          setProofResult(`Proof successful! ${addressToFetch} has ${ethGlobalBrusselsPOAPs.length} valid POAP(s) for ETHGlobal Brussels 2024.`);
          onVerified();
        } else if (poaps.length >= requiredPoapCount) {
          console.log(`Partial proof for ${addressToFetch}`);
          setProofResult(
            `${addressToFetch} has ${poaps.length} POAP(s) that might be related to ETHGlobal Brussels 2024, but they may not be the specific required ones. Please check with the event organizers.`
          );
        } else {
          console.log(`Insufficient POAPs found for ${addressToFetch}`);
          setProofResult(`${addressToFetch} has some POAPs, but none are specifically for ETHGlobal Brussels 2024.`);
        }
      } else {
        console.log(`No valid POAPs found for ${addressToFetch}`);
        setProofResult("No POAPs from ETHGlobal Brussels 2024 were found for this address.");
      }
    } catch (error) {
      console.error("Error fetching POAP data:", error);
      setProofResult(`An error occurred while fetching POAP data: ${(error as Error).message}`);
      setLocalPoaps([]);
      setMissingPoaps(eventIds);
    } finally {
      console.log(`Finished POAP fetch for ${addressToFetch}`);
      setIsVerifying(false);
    }
  },
  [onVerified, setPoaps, ETH_GLOBAL_BRUSSELS_2024_EVENT_ID],
);

  const handleVerifyAttendance = (): void => {
    const validAddress = manualAddress || userAddress;
    const isEthereumAddress = isValidEthereumAddress(validAddress);
    const isENS = validAddress?.endsWith(".eth");

    if (isEthereumAddress) {
      fetchPOAPs(validAddress);
    } else if (isENS) {
      if (isResolvingENS) {
        setProofResult("Resolving ENS name...");
      } else if (ensResolutionError || !resolvedAddress) {
        setProofResult("Unable to resolve ENS name. Please try again or use an Ethereum address.");
      } else if (resolvedAddress) {
        fetchPOAPs(resolvedAddress);
      }
    } else if (validAddress) {
      setProofResult("Please enter a valid Ethereum address or ENS name");
    } else {
      setProofResult("Please enter an Ethereum address or ENS name");
    }
  };

  const isValidEthereumAddress = (address: string): boolean =>
    /^0x[a-fA-F0-9]{40}$/.test(address) || /^[a-zA-Z0-9-]+\.eth$/.test(address);



  const handleImageError = (tokenId: string): void => {
    setImageLoadErrors(prev => ({ ...prev, [tokenId]: true }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Event Attendance Proof</h2>
      <p className="mb-6 text-center text-gray-600">Verify your attendance at ETHGlobal Brussels 2024:</p>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Enter Ethereum address or ENS name (optional)"
          value={manualAddress}
          onChange={(e): void => setManualAddress(e.target.value)}
          className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            manualAddress && !isValidEthereumAddress(manualAddress) ? "border-red-500" : "border-gray-300"
          }`}
          title="Enter your Ethereum address or ENS name to verify attendance"
        />
        {manualAddress && !isValidEthereumAddress(manualAddress) && (
          <p className="absolute -bottom-6 left-0 text-red-500 text-sm">
            Please enter a valid Ethereum address or ENS name
          </p>
        )}
      </div>
      <button
        onClick={handleVerifyAttendance}
        disabled={isVerifying || (!manualAddress && !userAddress)}
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {isVerifying ? "Verifying..." : "Verify Attendance"}
      </button>
      {proofResult && (
        <p className="mt-4 text-center text-gray-700">{proofResult}</p>
      )}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 mb-6 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Click to verify your attendance using POAPs"
      >
        {isVerifying ? "Verifying..." : "Verify Attendance"}
      </button>
      {proofResult && (
        <p className="mt-4 text-center text-gray-700">{proofResult}</p>
      )}
      {isVerifying && (
        <p className="text-blue-700 mb-6 text-center">
          Verifying attendance for {manualAddress || userAddress}...
        </p>
      )}
      {!isVerifying && !manualAddress && !userAddress && (
        <p className="text-red-600 mb-6 text-center">
          Please enter an Ethereum address or connect your wallet to verify attendance.
        </p>
      )}
      {localPoaps && localPoaps.length > 0 && (
        <div className="mt-6 bg-green-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-green-900 mb-4">ETHGlobal Brussels 2024 POAPs Found</h3>
          <p className="text-green-800 mb-6">
            {localPoaps.length === 1
              ? "You have the required POAP for ETHGlobal Brussels 2024."
              : `You have ${localPoaps.length} POAPs from ETHGlobal Brussels 2024.`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {localPoaps.map(poap => (
              <div
                key={poap.token_id}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <Image
                  src={
                    imageLoadErrors[poap.token_id]
                      ? "/placeholder-poap.png"
                      : poap.event?.image_url || "/placeholder-poap.png"
                  }
                  alt={poap.event?.name || "POAP"}
                  width={100}
                  height={100}
                  className="rounded-full mb-3"
                  onError={(): void => handleImageError(poap.token_id)}
                />
                <p className="text-sm font-medium text-center mb-1">{poap.event?.name || "Unknown Event"}</p>
                <p className="text-xs text-center text-gray-500 mb-2">
                  {poap.event?.start_date ? new Date(poap.event.start_date).toLocaleDateString() : "Date unknown"}
                </p>
                <p className="text-xs text-center text-blue-600">Token ID: {poap.token_id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {missingPoaps && missingPoaps.length > 0 && (
        <div className="mt-6 bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-900 mb-4">Missing POAPs</h3>
          <p className="text-yellow-800">The following POAPs were not found for your address:</p>
          <ul className="list-disc list-inside mt-2">
            {missingPoaps.map(poap => (
              <li key={poap} className="text-yellow-700">
                {poap}
              </li>
            ))}
          </ul>
        </div>
      )}
      {proofResult && (
        <div className={`mt-6 p-6 rounded-lg ${proofResult.includes("successful") ? "bg-green-100" : "bg-red-100"}`}>
          <p className={`flex items-center ${proofResult.includes("successful") ? "text-green-800" : "text-red-700"}`}>
            {proofResult.includes("successful") ? (
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {proofResult}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventAttendanceVerification;
