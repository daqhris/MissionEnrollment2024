import { verifyETHGlobalBrusselsPOAPOwnership } from "../../src/utils/poapVerification";
import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    let address;

    if (input.endsWith(".eth")) {
      // Resolve ENS name
      const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
      address = await provider.resolveName(input);
      if (!address) {
        return res.status(400).json({ error: "Invalid ENS name or resolution failed" });
      }
    } else if (ethers.utils.isAddress(input)) {
      address = ethers.utils.getAddress(input); // Checksum the address
    } else {
      return res.status(400).json({ error: "Invalid input format" });
    }

    // Verify POAP ownership
    const ownsPoap = await verifyETHGlobalBrusselsPOAPOwnership(address);

    if (ownsPoap) {
      return res.status(200).json({ verified: true, address });
    } else {
      return res.status(403).json({ error: "No ETHGlobal Brussels 2024 POAP found for this address" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
