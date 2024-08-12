import React, { useState } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider } from "ethers";
import { useAccount } from "wagmi";

// This component uses the Ethereum Attestation Service (EAS) protocol
// to create attestations on both Base and Optimism rollups

// Note: This is a simplified implementation. In a real-world scenario,
// you would need to properly integrate with EAS contracts and handle
// the complexities of creating and verifying attestations.

const EAS_CONTRACT_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia testnet
const SCHEMA_UID = "0x0000000000000000000000000000000000000000000000000000000000000000"; // Replace with actual schema UID
const ATTESTER_NAME = "daqhris.eth";

interface OnchainAttestationProps {
  onAttestationComplete: () => void;
  poaps: Array<{
    chain: string;
    contract_address: string;
    token_id: string;
    name: string;
    description: string;
    image_url: string;
    created_at: string;
    event_url: string;
    event_id: string;
  }>;
}

const OnchainAttestation: React.FC<OnchainAttestationProps> = ({ onAttestationComplete, poaps }) => {
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

      const schemaEncoder = new SchemaEncoder(
        "address recipient,uint256 tokenId,string eventName,uint256 timestamp,string rollup,string attester",
      );
      const poapData = poaps[0]; // Assuming we're using the first POAP for simplicity
      const encodedData = schemaEncoder.encodeData([
        { name: "recipient", value: address, type: "address" },
        { name: "tokenId", value: poapData.token_id, type: "uint256" },
        { name: "eventName", value: poapData.name, type: "string" },
        { name: "timestamp", value: Math.floor(Date.now() / 1000), type: "uint256" },
        { name: "rollup", value: selectedRollup, type: "string" },
        { name: "attester", value: ATTESTER_NAME, type: "string" },
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
      setAttestationStatus("Attestation failed. Please try again.");
    } finally {
      setIsAttesting(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Onchain Attestation</h2>
      <p className="mb-4">
        Receive an onchain attestation for completing the mission using the Ethereum Attestation Service (EAS) protocol:
      </p>
      <div className="mb-4">
        <label htmlFor="rollup" className="block mb-2 font-semibold">
          Select Rollup for Attestation:
        </label>
        <select
          id="rollup"
          value={selectedRollup}
          onChange={e => setSelectedRollup(e.target.value as "base" | "optimism")}
          className="w-full p-2 border rounded"
        >
          <option value="base">Base (Ethereum L2 Rollup)</option>
          <option value="optimism">Optimism (Ethereum L2 Rollup)</option>
        </select>
        <p className="mt-2 text-sm text-gray-600">
          Your attestation will be created on the selected rollup, leveraging its scalability and lower transaction
          costs.
        </p>
      </div>
      {poaps.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">POAP Data for Attestation:</h3>
          <ul className="list-disc pl-5">
            {poaps.map(poap => (
              <li key={poap.token_id}>
                {poap.name} - {new Date(poap.created_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-gray-600">
            This POAP data will be included in your onchain attestation as proof of your event attendance.
          </p>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Attestation Details:</h3>
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
        disabled={isAttesting || !address || !selectedRollup}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 w-full"
      >
        {isAttesting ? "Creating Attestation..." : `Request Attestation on ${selectedRollup}`}
      </button>
      {attestationStatus && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded">
          <p className="text-green-700">{attestationStatus}</p>
        </div>
      )}
    </div>
  );
};

export default OnchainAttestation;
