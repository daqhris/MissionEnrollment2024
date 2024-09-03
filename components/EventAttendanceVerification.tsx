import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import eventIdsData from "../event_ids.json";
import { useEnsAddress } from "wagmi";
import { ethers, poapContract, safePoapContractCall } from "../config";
import { BigNumber } from "ethers";

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
      const balance = await safePoapContractCall<BigNumber>('balanceOf', addressToFetch);
      if (!balance) {
        throw new Error("Failed to fetch POAP balance");
      }
      console.log(`POAP balance for ${addressToFetch}: ${balance.toString()}`);

      const poaps: POAPEvent[] = [];

      // Fetch POAP data for each token
      for (let i = 0; i < balance.toNumber(); i++) {
        try {
          console.log(`Fetching token ID for ${addressToFetch} at index ${i}`);
          const tokenId = await safePoapContractCall<BigNumber>('tokenOfOwnerByIndex', addressToFetch, i);
          if (!tokenId) {
            console.error(`Failed to fetch token ID for ${addressToFetch} at index ${i}`);
            continue;
          }
          console.log(`Token ID for ${addressToFetch} at index ${i}: ${tokenId.toString()}`);

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

          poaps.push({
            event: {
              id: tokenId.toString(),
              name: metadata.name || "Unknown Event",
              image_url: metadata.image || "",
              start_date: metadata.attributes?.find((attr: any) => attr.trait_type === 'event_date')?.value || '',
            },
            token_id: tokenId.toString(),
          });
        } catch (error) {
          console.error(`Error processing POAP data for token ${i}:`, error);
          // Continue to the next token if there's an error with the current one
          continue;
        }
      }

      console.log(`Total POAPs fetched for ${addressToFetch}:`, poaps.length);
      console.log(`Filtering POAPs for ETHGlobal Brussels 2024`);
      const filteredPoaps = poaps.filter(isEthGlobalBrusselsPOAP);
      console.log("Filtered POAPs:", filteredPoaps);

      console.log(`Setting local POAPs and updating state`);
      setLocalPoaps(filteredPoaps);
      setPoaps(filteredPoaps);

      const foundEventIds = filteredPoaps.map(poap => poap.event.id);
      const missingEventIds = eventIds.filter(id => !foundEventIds.includes(id));
      console.log(`Missing event IDs:`, missingEventIds);
      setMissingPoaps(missingEventIds);

      if (filteredPoaps.length > 0) {
        const requiredPoapCount = 1;
        if (filteredPoaps.length >= requiredPoapCount) {
          console.log(`Proof successful for ${addressToFetch}`);
          setProofResult(`Proof successful! ${addressToFetch} has a valid POAP for ETHGlobal Brussels 2024.`);
          onVerified();
        } else {
          console.log(`Partial proof for ${addressToFetch}`);
          setProofResult(
            `${addressToFetch} has a POAP from ETHGlobal Brussels 2024, but it may not be the specific required one. Please check with the event organizers.`,
          );
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
  [onVerified, setPoaps, eventIds, poapContract, safePoapContractCall],
);

  useEffect((): void => {
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
    }
  }, [userAddress, manualAddress, fetchPOAPs, resolvedAddress, isResolvingENS, ensResolutionError]);

  const isValidEthereumAddress = (address: string): boolean =>
    /^0x[a-fA-F0-9]{40}$/.test(address) || /^[a-zA-Z0-9-]+\.eth$/.test(address);

  const isEthGlobalBrusselsPOAP = (poap: POAPEvent): boolean => {
    const eventDate = new Date(poap.event.start_date);
    return (
      poap.event.name.toLowerCase().includes("ethglobal brussels") &&
      poap.event.name.toLowerCase().includes("2024") &&
      eventDate.getFullYear() === 2024 &&
      eventDate >= new Date("2024-07-11") &&
      eventDate <= new Date("2024-07-14")
    );
  };

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
        onClick={(): void => {
          const addressToUse = manualAddress || userAddress;
          if (addressToUse && isValidEthereumAddress(addressToUse)) {
            fetchPOAPs(addressToUse);
          } else {
            setProofResult("Please enter a valid Ethereum address or ENS name, or connect your wallet");
          }
        }}
        disabled={isVerifying || (!manualAddress && !userAddress)}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 mb-6 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Click to verify your attendance using POAPs"
      >
        {isVerifying ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Verifying...
          </span>
        ) : (
          "Verify Attendance"
        )}
      </button>
      {isVerifying && (
        <p className="text-blue-700 mb-6 text-center">Verifying attendance for {manualAddress || userAddress}...</p>
      )}
      {!isVerifying && !manualAddress && !userAddress && (
        <p className="text-yellow-600 mb-6 text-center">
          Please connect your wallet or enter an Ethereum address or ENS name to verify
        </p>
      )}
      {localPoaps && localPoaps.length > 0 && (
        <div className="mt-6 bg-green-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-green-900 mb-4">POAPs Found</h3>
          <p className="text-green-800 mb-6">
            {localPoaps.length === eventIds.length
              ? "You have all required POAPs for ETHGlobal Brussels 2024."
              : `You have ${localPoaps.length} out of ${eventIds.length} required POAPs for ETHGlobal Brussels 2024.`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {localPoaps.map(poap => (
              <div
                key={poap.token_id}
                className="flex flex-col items-center p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <Image
                  src={
                    imageLoadErrors[poap.token_id]
                      ? "/placeholder-poap.png"
                      : poap.event?.image_url || "/placeholder-poap.png"
                  }
                  alt={poap.event?.name || "POAP"}
                  width={80}
                  height={80}
                  className="rounded-full mb-2"
                  onError={(): void => handleImageError(poap.token_id)}
                />
                <p className="text-sm font-medium text-center">{poap.event?.name || "Unknown Event"}</p>
                <p className="text-xs text-center text-gray-500">
                  {poap.event?.start_date ? new Date(poap.event.start_date).toLocaleDateString() : "Date unknown"}
                </p>
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
