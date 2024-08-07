import React, { useState } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount } from "wagmi";

// Note: This is a simplified implementation. In a real-world scenario,
// you would need to properly integrate with EAS contracts and handle
// the complexities of creating and verifying attestations.

const EAS_CONTRACT_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia testnet
const SCHEMA_UID = "0x0000000000000000000000000000000000000000000000000000000000000000"; // Replace with actual schema UID

const OnchainAttestation: React.FC<{ onAttestationComplete: () => void }> = ({ onAttestationComplete }) => {
  const { address } = useAccount();
  const [isAttesting, setIsAttesting] = useState(false);
  const [attestationStatus, setAttestationStatus] = useState<string | null>(null);

  const handleAttestation = async () => {
    if (!address) {
      setAttestationStatus("Error: Wallet not connected");
      return;
    }

    setIsAttesting(true);
    setAttestationStatus("Initiating attestation...");

    try {
      // Initialize EAS SDK
      const eas = new EAS(EAS_CONTRACT_ADDRESS);

      // Connect to the provider (assuming MetaMask is connected)
      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      eas.connect(signer);

      // Encode the attestation data
      const schemaEncoder = new SchemaEncoder("bool completedMission");
      const encodedData = schemaEncoder.encodeData([{ name: "completedMission", value: true, type: "bool" }]);

      // Create the attestation
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

      setAttestationStatus(`Attestation created successfully. UID: ${newAttestationUID}`);
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
      <p className="mb-4">Receive an onchain attestation for completing the mission:</p>
      <button
        onClick={handleAttestation}
        disabled={isAttesting || !address}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {isAttesting ? "Creating Attestation..." : "Request Attestation"}
      </button>
      {attestationStatus && <p className="mt-4 text-green-500">{attestationStatus}</p>}
    </div>
  );
};

export default OnchainAttestation;
