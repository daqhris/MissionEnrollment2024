import React, { useState } from "react";
import type { ChangeEvent } from "react";

interface IdentityVerificationProps {
  onVerified: (address: string) => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = (): JSX.Element => {
  const [inputAddress, setInputAddress] = useState<string>("");
  // const [isVerifying, setIsVerifying] = useState<boolean>(false);
  // const [error, setError] = useState<string>("");

  // useEffect((): void => {
  //   if (inputAddress) {
  //     setError("");
  //   }
  // }, [inputAddress]);

  // const handleVerify = async (): Promise<void> => {
  //   setIsVerifying(true);
  //   setError("");

  //   try {
  //     let verifiedAddress = inputAddress.trim();

  //     if (verifiedAddress.includes('.')) {
  //       // Potential ENS name
  //       const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
  //       verifiedAddress = await provider.resolveName(verifiedAddress);
  //       if (!verifiedAddress) {
  //         throw new Error("Unable to resolve ENS name");
  //       }
  //     } else {
  //       // Check if it's a valid Ethereum address
  //       if (!isAddress(verifiedAddress)) {
  //         throw new Error("Invalid Ethereum address format");
  //       }
  //       // Normalize the address to checksum format
  //       verifiedAddress = getAddress(verifiedAddress);
  //     }

  //     // Ensure the address is valid after all checks
  //     if (!isAddress(verifiedAddress)) {
  //       throw new Error("Invalid address after verification");
  //     }

  //     onVerified(verifiedAddress.toLowerCase());
  //   } catch (err: unknown) {
  //     console.error("Verification error:", err);
  //     setError(err instanceof Error ? err.message : "Verification failed");
  //   } finally {
  //     setIsVerifying(false);
  //   }
  // };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputAddress(e.target.value);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Identity Verification</h2>
      <p className="mb-4">Please enter your Ethereum address or ENS name:</p>
      <div className="relative">
        <input
          type="text"
          value={inputAddress}
          onChange={handleInputChange}
          className="w-full max-w-md p-2 border rounded mb-4"
          placeholder="0x... or example.eth"
        />
      </div>
      <button
        onClick={() => console.log('Verify button clicked')}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Verify
      </button>
    </div>
  );
};

export default IdentityVerification;
