import axios from "axios";

const GNOSIS_EVENT_ID = "176328";
const TEST_ADDRESS = "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82";

export default async function handler(req, res) {
  console.log("Incoming request:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
  });

  let { address } = req.query;

  if (!address) {
    console.warn("Address is missing in the request, using test address");
    address = TEST_ADDRESS;
  }

  try {
    console.log(`Fetching POAPs for address: ${address}`);
    const poapUrl = `https://api.poap.tech/actions/scan/${address}`;
    console.log(`Full POAP API URL: ${poapUrl}`);
    const poapResponse = await axios.get(poapUrl, {
      headers: {
        "X-API-Key": process.env.POAP_API_KEY,
      },
      params: {
        chain: "xdai", // Gnosis chain
        event_id: GNOSIS_EVENT_ID,
      },
    });

    console.log("POAP API response:", JSON.stringify(poapResponse.data, null, 2));

    if (poapResponse.status !== 200) {
      throw new Error(`Failed to fetch POAPs: ${poapResponse.statusText}`);
    }

    const allPoaps = poapResponse.data;
    console.log("Fetched POAPs:", JSON.stringify(allPoaps, null, 2));

    const requiredPoaps = allPoaps
      .filter(poap => poap.event && poap.event.id && poap.event.id.toString() === GNOSIS_EVENT_ID)
      .map(poap => ({
        event: {
          id: poap.event.id,
          name: poap.event.name || "Unknown Event",
          start_date: poap.event.start_date || "",
          image_url: poap.event.image_url || "",
        },
        tokenId: poap.tokenId || "",
      }));

    if (requiredPoaps.length > 0) {
      console.log(`Required POAP found for address ${address}:`, JSON.stringify(requiredPoaps, null, 2));
      res.status(200).json({
        poaps: requiredPoaps,
        message: `Found POAP for ETHGlobal Brussels 2024 event (ID: ${GNOSIS_EVENT_ID}).`,
      });
    } else {
      console.log(`No required POAP found for address ${address}`);
      res.status(200).json({
        poaps: [],
        message: "No POAP found for ETHGlobal Brussels 2024 event for this address.",
      });
    }
  } catch (error) {
    console.error("Error fetching POAP data:", error);
    console.error("Full error details:", {
      message: error.message,
      stack: error.stack,
      request: error.config
        ? {
            url: error.config.url,
            method: error.config.method,
            headers: error.config.headers,
            params: error.config.params,
          }
        : "No request config",
      response: error.response
        ? {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers,
            data: error.response.data,
          }
        : "No response data",
    });

    let errorMessage = "Failed to fetch POAP data. Please try again.";
    let statusCode = 500;

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = "No POAPs found for this address on the Gnosis chain.";
        statusCode = 404;
      } else if (error.response.status === 401) {
        errorMessage = "Unauthorized access to POAP data. Please check API credentials.";
        statusCode = 401;
      }
    } else if (error.request) {
      errorMessage = "No response received from POAP API. Please try again later.";
    }

    res.status(statusCode).json({ error: errorMessage, details: error.message });
  }
}
