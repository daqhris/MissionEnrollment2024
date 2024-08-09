import axios from "axios";

const POAP_API_KEY = process.env.POAP;
const POAP_API_BASE_URL = "https://api.poap.tech";

// ETHGlobal Brussels 2024 POAP event IDs
const ETHGLOBAL_BRUSSELS_2024_EVENT_IDS = ["176334", "176328", "176329", "176330", "176331", "176332"];

/**
 * Verify if a user owns a POAP from a specific event
 * @param {string} address - The user's Ethereum address
 * @param {string} eventId - The POAP event ID
 * @returns {Promise<boolean>} - True if the user owns a POAP from the event, false otherwise
 */
async function verifyPOAPOwnership(address, eventId) {
  try {
    const response = await axios.get(`${POAP_API_BASE_URL}/actions/scan/${address}/${eventId}`, {
      headers: {
        "X-API-Key": POAP_API_KEY,
      },
    });

    return response.data.length > 0;
  } catch (error) {
    console.error("Error verifying POAP ownership:", error);
    return false;
  }
}

/**
 * Verify if a user owns any of the ETHGlobal Brussels 2024 POAPs
 * @param {string} address - The user's Ethereum address
 * @returns {Promise<boolean>} - True if the user owns any of the ETHGlobal Brussels 2024 POAPs, false otherwise
 */
async function verifyETHGlobalBrusselsPOAPOwnership(address) {
  for (const eventId of ETHGLOBAL_BRUSSELS_2024_EVENT_IDS) {
    const ownsPoap = await verifyPOAPOwnership(address, eventId);
    if (ownsPoap) {
      return true;
    }
  }
  return false;
}

module.exports = {
  verifyPOAPOwnership,
  verifyETHGlobalBrusselsPOAPOwnership,
};
