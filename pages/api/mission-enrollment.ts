import { EAS, Offchain, SchemaEncoder, OffchainAttestationVersion } from "@ethereum-attestation-service/eas-sdk";
import type { OffchainAttestationParams, OffchainConfig } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { missionProposal } = req.body;

    if (typeof missionProposal !== "string" || missionProposal.trim() === "") {
      res.status(400).json({ error: "Invalid mission proposal" });
      return;
    }

    const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
    const missionEnrollmentSchemaUid = "0x40e5abe23a3378a9a43b7e874c5cb8dfd4d6b0823501d317acee41e08d3af4dd";

    const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");

    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const eas = new EAS(EASContractAddress);
    await eas.connect(wallet);

    const schemaEncoder = new SchemaEncoder("string missionProposal");

    const encodedData = schemaEncoder.encodeData([{ name: "missionProposal", value: missionProposal, type: "string" }]);

    const network = await provider.getNetwork();
    const offchainConfig: OffchainConfig = {
      address: EASContractAddress,
      version: "1.0.0",
      chainId: BigInt(network.chainId)
    };
    const offchain = new Offchain(offchainConfig, OffchainAttestationVersion.Version1, eas);

    const offchainAttestationParams: OffchainAttestationParams = {
      recipient: ethers.ZeroAddress,
      expirationTime: BigInt(0),
      time: BigInt(Math.floor(Date.now() / 1000)),
      revocable: true,
      refUID: ethers.ZeroHash,
      data: encodedData,
      schema: missionEnrollmentSchemaUid,
    };

    const offchainAttestation = await offchain.signOffchainAttestation(
      offchainAttestationParams,
      wallet
    );

    res.status(200).json({ result: offchainAttestation });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: `Error creating mission enrollment attestation: ${error.message}` });
    } else {
      res.status(500).json({ error: "An unknown error occurred while creating mission enrollment attestation" });
    }
  }
}
