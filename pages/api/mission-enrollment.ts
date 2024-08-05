import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { missionProposal } = req.body;

    const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
    const missionEnrollmentSchemaUid = "0x40e5abe23a3378a9a43b7e874c5cb8dfd4d6b0823501d317acee41e08d3af4dd";
    const provider = new ethers.AlchemyProvider("sepolia", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(process.env.ETH_KEY as string, provider);
    const eas = new EAS(EASContractAddress);
    eas.connect(signer);

    const schemaEncoder = new SchemaEncoder("string missionProposal");

    const data = schemaEncoder.encodeData([
      {
        type: "string",
        value: missionProposal,
        name: "missionProposal",
      },
    ]);

    const offchain = await eas.getOffchain();

    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        recipient: ethers.ZeroAddress,
        data,
        refUID: ethers.ZeroHash,
        revocable: true,
        expirationTime: BigInt(0),
        time: BigInt(Math.floor(Date.now() / 1000)),
        schema: missionEnrollmentSchemaUid,
      },
      signer
    );

    const encodedOffchainAttestation = await offchain.packOffchainAttestation(offchainAttestation);

    return res.status(200).json({ result: encodedOffchainAttestation });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error creating mission enrollment attestation" });
  }
}
