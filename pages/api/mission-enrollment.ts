import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { missionProposal } = req.body;

    const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
    const missionEnrollmentSchemaUid = "0x40e5abe23a3378a9a43b7e874c5cb8dfd4d6b0823501d317acee41e08d3af4dd";

    const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");

    // Note: The signer should be initialized in a secure way, not using environment variables
    // This is a placeholder and should be replaced with a proper secure method
    const signer = new ethers.Wallet("YOUR_PRIVATE_KEY_HERE", provider);

    const eas = new EAS(EASContractAddress);
    await eas.connect(signer);

    const schemaEncoder = new SchemaEncoder("string missionProposal");

    const encodedData = schemaEncoder.encodeData([{ name: "missionProposal", value: missionProposal, type: "string" }]);

    const offchain = await eas.getOffchain();

    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        recipient: ethers.ZeroAddress,
        data: encodedData,
        refUID: ethers.ZeroHash,
        revocable: true,
        expirationTime: BigInt(0),
        time: BigInt(Math.floor(Date.now() / 1000)),
        schema: missionEnrollmentSchemaUid,
      },
      signer,
    );

    return res.status(200).json({ result: offchainAttestation });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error creating mission enrollment attestation" });
  }
}
