import React, { useEffect, useState } from "react";
import { useEnsAddress, useEnsName } from "wagmi";
import { isAddress, getAddress } from "ethers";

const IdentityVerification: React.FC<{ onVerified: (address: string) => void }> = ({ onVerified }) => {
  const [inputAddress, setInputAddress] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { data: ensName, isLoading: isEnsNameLoading } = useEnsName({
    address: isAddress(inputAddress) ? inputAddress as `0x${string}` : undefined,
    chainId: 1 // Assuming mainnet, adjust if needed
  });
  const { data: ensAddress, isLoading: isEnsAddressLoading } = useEnsAddress({
    name: inputAddress.includes('.') ? inputAddress : undefined,
    chainId: 1 // Assuming mainnet, adjust if needed
  });

  const isLoading = isEnsNameLoading || isEnsAddressLoading;

  useEffect((): void => {
    if (inputAddress) {
      setError("");
    }
  }, [inputAddress]);

  const handleVerify = async (): Promise<void> => {
    setIsVerifying(true);
    setError("");

    try {
      let verifiedAddress = inputAddress.trim();

      if (verifiedAddress.includes('.')) {
        // Potential ENS name
        if (isLoading) {
          // Wait for ENS resolution to complete
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        if (!ensAddress) {
          throw new Error("Invalid ENS name or ENS resolution failed");
        }
        verifiedAddress = ensAddress;
      } else {
        // Check if it's a valid Ethereum address
        if (!isAddress(verifiedAddress)) {
          throw new Error("Invalid Ethereum address format");
        }
        // Normalize the address to checksum format
        verifiedAddress = getAddress(verifiedAddress);
      }

      // Ensure the address is valid after all checks
      if (!isAddress(verifiedAddress)) {
        throw new Error("Invalid address after verification");
      }

      onVerified(verifiedAddress);
    } catch (err) {
      console.error("Verification error:", err);
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Identity Verification</h2>
      <p className="mb-4">Please enter your ENS name or Ethereum address:</p>
      <div className="relative">
        <input
          type="text"
          value={inputAddress}
          onChange={(e): void => setInputAddress(e.target.value)}
          className="w-full max-w-md p-2 border rounded mb-4"
          placeholder="vitalik.eth or 0x..."
          disabled={isVerifying || isLoading}
        />
        {isLoading && (
          <span className="absolute right-3 top-2 text-blue-700" role="status" aria-label="Loading">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
      </div>
      {isLoading && (
        <p role="status" className="mb-2 text-blue-700">
          Resolving ENS name...
        </p>
      )}
      {!isLoading && ensName && <p className="mb-2 text-green-700">Resolved ENS Name: {ensName}</p>}
      {!isLoading && ensAddress && <p className="mb-2 text-green-700">Resolved Address: {ensAddress}</p>}
      <button
        onClick={handleVerify}
        disabled={isVerifying || !inputAddress.trim() || isLoading}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200"
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default IdentityVerification;
