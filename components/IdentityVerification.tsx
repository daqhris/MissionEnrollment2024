import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { isAddress, getAddress } from "viem";

interface IdentityVerificationProps {
  onVerified: (address: string) => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onVerified }): JSX.Element => {
  const [inputAddress, setInputAddress] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
        throw new Error("ENS resolution is not implemented in this component");
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
    } catch (err: unknown) {
      console.error("Verification error:", err);
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputAddress(e.target.value);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Identity Verification</h2>
      <p className="mb-4">Please enter your Ethereum address:</p>
      <div className="relative">
        <input
          type="text"
          value={inputAddress}
          onChange={handleInputChange}
          className="w-full max-w-md p-2 border rounded mb-4"
          placeholder="0x..."
          disabled={isVerifying}
        />
      </div>
      <button
        onClick={handleVerify}
        disabled={isVerifying || !inputAddress.trim()}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200"
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default IdentityVerification;
