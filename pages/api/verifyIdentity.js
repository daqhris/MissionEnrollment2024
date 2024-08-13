import { verifyETHGlobalBrusselsPOAPOwnership } from "../../src/utils/poapVerification";
import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { input } = req.body;

  console.log("Received input:", input); // Log the input for debugging

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    let address;

    if (typeof input === "string" && input.endsWith(".eth")) {
      // Resolve ENS name
      const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
      address = await provider.resolveName(input);
      if (!address) {
        console.log("ENS resolution failed for:", input);
        return res.status(400).json({ error: "Invalid ENS name or resolution failed" });
      }
    } else if (typeof input === "string" && ethers.isAddress(input)) {
      address = ethers.getAddress(input); // Checksum the address
    } else {
      console.log("Invalid input format:", input);
      return res.status(400).json({ error: "Invalid input format" });
    }

    console.log("Resolved address:", address);

    // Verify POAP ownership
    const ownsPoap = await verifyETHGlobalBrusselsPOAPOwnership(address);

    if (ownsPoap) {
      return res.status(200).json({ verified: true, address });
    } else {
      return res.status(403).json({ error: "No ETHGlobal Brussels 2024 POAP found for this address" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
