import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import eventIdsData from "../event_ids.json";
import { useEnsAddress } from "wagmi";
import { debounce } from "lodash";
import { ethers } from "ethers";
import POAPContractABI from "../contracts/POAPContract.json";
import { POAP_CONTRACT_ADDRESS } from "../config";
import axios from "axios";

const IPFS_GATEWAY_URL = "https://ipfs.io/ipfs/";

const { eventIds } = eventIdsData;
const DEBOUNCE_DELAY = 300; // milliseconds

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
  signer: ethers.Signer;
}

const EventAttendanceVerification: React.FC<EventAttendanceVerificationProps> = ({
  onVerified,
  setPoaps,
  userAddress,
  signer,
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
      setIsVerifying(true);
      setProofResult(null);
      setLocalPoaps([]);
      setMissingPoaps([]);

      try {
        console.log(`Fetching POAPs for address: ${addressToFetch}`);

        if (!signer) {
          throw new Error("Signer is not available");
        }

        // Create a contract instance
        const contract = new ethers.Contract(POAP_CONTRACT_ADDRESS, POAPContractABI, signer);

        // Check if required methods exist
        if (!contract.balanceOf || !contract.tokenOfOwnerByIndex || !contract.tokenURI) {
          throw new Error("Contract is missing required methods");
        }

        // Get the balance of POAPs for the address
        const balance = await contract.balanceOf(addressToFetch);
        if (!balance) {
          throw new Error("Failed to fetch POAP balance");
        }

        const poaps: POAPEvent[] = [];

        // Fetch POAP metadata for each token
        for (let i = 0; i < balance.toNumber(); i++) {
          try {
            const tokenId = await contract.tokenOfOwnerByIndex(addressToFetch, i);
            const tokenURI = await contract.tokenURI(tokenId);

            // Convert tokenURI to IPFS URL if it's an IPFS hash
            const metadataURL = tokenURI.startsWith('ipfs://')
              ? `${IPFS_GATEWAY_URL}${tokenURI.slice(7)}`
              : tokenURI;

            // Fetch metadata from IPFS or original URL
            const response = await fetch(metadataURL);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const metadata = await response.json();

            const imageUrl = metadata.image?.startsWith('ipfs://')
              ? `${IPFS_GATEWAY_URL}${metadata.image.slice(7)}`
              : metadata.image || "";

            poaps.push({
              event: {
                id: tokenId.toString(),
                name: metadata.name || "Unknown Event",
                image_url: imageUrl,
                start_date: metadata.attributes?.find((attr: any) => attr.trait_type === 'event_date')?.value || '',
              },
              token_id: tokenId.toString(),
            });
          } catch (tokenError) {
            console.warn(`Failed to fetch token data for index ${i}:`, tokenError);
            continue;
          }
        }

        const filteredPoaps = poaps.filter(isEthGlobalBrusselsPOAP);

        console.log("Filtered POAPs:", filteredPoaps);

        setLocalPoaps(filteredPoaps);
        setPoaps(filteredPoaps);

        const foundEventIds = filteredPoaps.map(poap => poap.event.id);
        const missingEventIds = eventIds.filter(id => !foundEventIds.includes(id));
        setMissingPoaps(missingEventIds);

        if (filteredPoaps.length > 0) {
          const requiredPoapCount = 1;
          if (filteredPoaps.length >= requiredPoapCount) {
            setProofResult(`Proof successful! ${addressToFetch} has a valid POAP for ETHGlobal Brussels 2024.`);
            onVerified();
          } else {
            setProofResult(
              `${addressToFetch} has a POAP from ETHGlobal Brussels 2024, but it may not be the specific required one. Please check with the event organizers.`,
            );
          }
        } else {
          setProofResult("No POAPs from ETHGlobal Brussels 2024 were found for this address.");
        }
      } catch (error) {
        console.error("Error fetching POAP data:", error);
        setProofResult(`An error occurred while fetching POAP data: ${(error as Error).message}`);
        setLocalPoaps([]);
        setMissingPoaps(eventIds);
      }

      setIsVerifying(false);
    },
    [onVerified, setPoaps, signer, POAP_CONTRACT_ADDRESS, POAPContractABI, eventIds],
  );

  const debouncedFetchPOAPs = useCallback(
    debounce((address: string) => {
      fetchPOAPs(address);
    }, DEBOUNCE_DELAY),
    [fetchPOAPs, DEBOUNCE_DELAY]
  );

  useEffect((): void => {
    const validAddress = manualAddress || userAddress;
    const isEthereumAddress = isValidEthereumAddress(validAddress);
    const isENS = validAddress?.endsWith(".eth");

    if (!validAddress) {
      setProofResult(null);
      return;
    }

    if (isEthereumAddress) {
      debouncedFetchPOAPs(validAddress);
    } else if (isENS) {
      if (isResolvingENS) {
        setProofResult("Resolving ENS name...");
      } else if (ensResolutionError || !resolvedAddress) {
        setProofResult("Unable to resolve ENS name. Please try again or use an Ethereum address.");
      } else if (resolvedAddress) {
        debouncedFetchPOAPs(resolvedAddress);
      }
    } else {
      setProofResult("Please enter a valid Ethereum address or ENS name");
    }
  }, [userAddress, manualAddress, debouncedFetchPOAPs, resolvedAddress, isResolvingENS, ensResolutionError]);

  const isValidEthereumAddress = (address: string): boolean =>
    /^0x[a-fA-F0-9]{40}$/.test(address) || /^[a-zA-Z0-9-]+\.eth$/.test(address);

  const isEthGlobalBrusselsPOAP = (poap: POAPEvent): boolean => {
    if (!poap.event || !poap.event.name || !poap.event.start_date) {
      return false;
    }
    const eventName = poap.event.name.toLowerCase();
    const eventDate = new Date(poap.event.start_date);
    return (
      eventName.includes("ethglobal") &&
      eventName.includes("brussels") &&
      eventName.includes("2024") &&
      !isNaN(eventDate.getTime()) &&
      eventDate.getFullYear() === 2024 &&
      eventDate >= new Date("2024-07-11") &&
      eventDate <= new Date("2024-07-14")
    );
  };

  const handleImageError = (tokenId: string): void => {
    setImageLoadErrors(prev => ({ ...prev, [tokenId]: true }));
  };

  const handleVerifyClick = (): void => {
    const addressToUse = manualAddress || userAddress;
    if (addressToUse && isValidEthereumAddress(addressToUse)) {
      fetchPOAPs(addressToUse);
    } else {
      setProofResult("Please enter a valid Ethereum address or ENS name, or connect your wallet");
    }
  };

  const debouncedHandleAddressChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setManualAddress(e.target.value);
    }, DEBOUNCE_DELAY),
    [setManualAddress, DEBOUNCE_DELAY]
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Event Attendance Proof</h2>
      <p className="mb-6 text-center text-gray-600">Verify your attendance at ETHGlobal Brussels 2024:</p>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Enter Ethereum address or ENS name (optional)"
          value={manualAddress}
          onChange={(e): void => debouncedHandleAddressChange(e)}
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
        onClick={handleVerifyClick}
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
