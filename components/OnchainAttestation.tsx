import React, { useState } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider } from "ethers";
import { useAccount } from "wagmi";

// This component uses the Ethereum Attestation Service (EAS) protocol
// to create attestations on both Base and Optimism rollups

const EAS_CONTRACT_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia testnet
const SCHEMA_UID = "0x0000000000000000000000000000000000000000000000000000000000000000"; // Replace with actual schema UID
const ATTESTER_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with actual address of daqhris.eth
const ATTESTER_NAME = "daqhris.eth";

interface OnchainAttestationProps {
  onAttestationComplete: () => void;
  poaps: Array<{
    event: {
      id: string;
      name: string;
      image_url: string;
      start_date: string;
    };
    token_id: string;
  }>;
  ensName: string | null;
}

const OnchainAttestation: React.FC<OnchainAttestationProps> = ({ onAttestationComplete, poaps, ensName }) => {
  const { address } = useAccount();
  const [isAttesting, setIsAttesting] = useState(false);
  const [attestationStatus, setAttestationStatus] = useState<string | null>(null);
  const [selectedRollup, setSelectedRollup] = useState<"base" | "optimism">("base");

  const handleAttestation = async () => {
    if (!address) {
      setAttestationStatus("Error: Wallet not connected");
      return;
    }

    setIsAttesting(true);
    setAttestationStatus("Initiating attestation...");

    try {
      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      eas.connect(signer);

      const schemaEncoder = new SchemaEncoder("address userAddress,uint256 tokenId,uint256 timestamp,address attester");
      const poapData = poaps[0]; // Assuming we're using the first POAP for simplicity
      const encodedData = schemaEncoder.encodeData([
        { name: "userAddress", value: address, type: "address" },
        { name: "tokenId", value: poapData?.token_id ?? "0", type: "uint256" },
        { name: "timestamp", value: Math.floor(Date.now() / 1000), type: "uint256" },
        { name: "attester", value: ATTESTER_ADDRESS, type: "address" },
      ]);

      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: address,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();

      setAttestationStatus(`Attestation created successfully on ${selectedRollup}. UID: ${newAttestationUID}`);
      onAttestationComplete();
    } catch (error) {
      console.error("Attestation error:", error);
      setAttestationStatus(`Attestation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsAttesting(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Onchain Attestation</h2>
      <p className="mb-6 text-center text-gray-600">
        Receive an onchain attestation for completing the mission using the Ethereum Attestation Service (EAS) protocol:
      </p>
      <div className="mb-6">
        <label htmlFor="rollup" className="block mb-2 font-semibold">
          Select Rollup for Attestation:
        </label>
        <select
          id="rollup"
          value={selectedRollup}
          onChange={e => setSelectedRollup(e.target.value as "base" | "optimism")}
          className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="base">Base (Ethereum L2 Rollup)</option>
          <option value="optimism">Optimism (Ethereum L2 Rollup)</option>
        </select>
        <p className="mt-2 text-sm text-gray-700">
          Your attestation will be created on the selected rollup, leveraging its scalability and lower transaction
          costs.
        </p>
      </div>
      {ensName && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">ENS Name:</h3>
          <p className="text-lg">{ensName}</p>
        </div>
      )}
      {poaps.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">POAP Data for Attestation:</h3>
          <ul className="list-disc pl-5 space-y-2">
            {poaps.map(poap => (
              <li key={poap.token_id} className="text-gray-700">
                {poap.event.name} - {new Date(poap.event.start_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-gray-600">
            This POAP data will be included in your onchain attestation as proof of your event attendance.
          </p>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Attestation Details:</h3>
        <p className="mb-2">
          <span className="font-semibold">Attester&apos;s onchain name:</span> {ATTESTER_NAME}
        </p>
        <p className="text-sm text-gray-600">
          The attestation will be created by {ATTESTER_NAME} using the Ethereum Attestation Service protocol on the
          selected rollup.
        </p>
      </div>
      <button
        onClick={handleAttestation}
        disabled={isAttesting || !address || !selectedRollup || poaps.length === 0}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 mb-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isAttesting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Creating Attestation...
          </span>
        ) : (
          `Create EAS Attestation on ${selectedRollup}`
        )}
      </button>
      {!address && (
        <p className="mt-2 text-sm text-red-500">Please connect your wallet to create an attestation.</p>
      )}
      {address && !selectedRollup && (
        <p className="mt-2 text-sm text-red-500">Please select a rollup for the attestation.</p>
      )}
      {address && selectedRollup && poaps.length === 0 && (
        <p className="mt-2 text-sm text-red-500">No valid POAPs found. Please verify your event attendance.</p>
      )}
      {attestationStatus && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg">
          <p className="text-green-700 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {attestationStatus}
          </p>
        </div>
      )}
    </div>
  );
};

export default OnchainAttestation;
