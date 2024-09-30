import axios from "axios";

const POAP_API_KEY = process.env.POAP_API_KEY;
const POAP_API_BASE_URL = "https://api.poap.tech";

// ETHGlobal Brussels 2024 POAP event IDs
const ETHGLOBAL_BRUSSELS_2024_EVENT_IDS = ["176334", "176328", "176329", "176330", "176331", "176332"];

// Mapping of POAP event IDs to their corresponding PNG image URLs
const POAP_IMAGE_URLS = {
  "176334": "https://assets.poap.xyz/c5cb8bb2-e0ae-428e-bc77-c55d0dc8b02e.png",
  "176328": "https://assets.poap.xyz/7d38ca82-4fa6-41f4-b526-cfd1894e168b.png",
  "176329": "https://assets.poap.xyz/ba72648e-b534-4630-80bf-caf648ee9ba9.png",
  "176330": "https://assets.poap.xyz/50e25677-94d0-424e-8bda-5b7acc655516.png",
  "176331": "https://assets.poap.xyz/3c556f78-7722-497b-b9fe-b6c45a7a05e4.png",
  "176332": "https://assets.poap.xyz/9b7601c6-9667-46b9-b5e2-6494726a7793.png"
};

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

    console.log(`POAP ownership response for event ${eventId}:`, JSON.stringify(response.data, null, 2));

    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log(`POAP found for event ${eventId}:`, JSON.stringify(response.data[0], null, 2));
      console.log(`POAP image URL: ${POAP_IMAGE_URLS[eventId]}`);
      return true;
    } else if (typeof response.data === "object" && response.data !== null && Object.keys(response.data).length > 0) {
      console.log(`POAP found for event ${eventId}:`, JSON.stringify(response.data, null, 2));
      console.log(`POAP image URL: ${POAP_IMAGE_URLS[eventId]}`);
      return true;
    }

    console.log(`No POAP found for event ${eventId}`);
    return false;
  } catch (error) {
    console.error(`Error verifying POAP ownership for address ${address} and event ${eventId}:`, error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));

      if (error.response.status === 404) {
        console.log(`No POAPs found for address ${address} and event ${eventId}`);
        return false;
      } else if (error.response.status === 401) {
        console.error("Unauthorized: Invalid API key");
        throw new Error("Invalid API key");
      }
    }
    console.error("Returning false due to API error");
    return false;
  }
}

/**
 * Verify if a user owns any of the ETHGlobal Brussels 2024 POAPs
 * @param {string} address - The user's Ethereum address
 * @returns {Promise<boolean>} - True if the user owns any of the ETHGlobal Brussels 2024 POAPs, false otherwise
 */
async function verifyETHGlobalBrusselsPOAPOwnership(address) {
  console.log(`Verifying POAP ownership for address: ${address}`);
  let verificationErrors = 0;

  for (const eventId of ETHGLOBAL_BRUSSELS_2024_EVENT_IDS) {
    try {
      console.log(`Checking POAP ownership for event ${eventId}...`);
      const ownsPoap = await verifyPOAPOwnership(address, eventId);

      if (ownsPoap) {
        console.log(`✅ User owns POAP for event ${eventId}`);
        return true;
      } else {
        console.log(`❌ User does not own POAP for event ${eventId}`);
      }
    } catch (error) {
      console.error(`Error verifying POAP for event ${eventId}:`, error.message);
      verificationErrors++;
      // Continue checking other event IDs even if one fails
    }
  }

  if (verificationErrors === ETHGLOBAL_BRUSSELS_2024_EVENT_IDS.length) {
    console.error("Failed to verify POAPs for all events due to errors");
  } else {
    console.log("User does not own any ETHGlobal Brussels 2024 POAPs");
  }
  return false;
}

module.exports = {
  verifyPOAPOwnership,
  verifyETHGlobalBrusselsPOAPOwnership,
};
