import axios from 'axios';
import { readFileSync } from 'fs';
import path from 'path';

const eventIdsPath = path.join(process.cwd(), 'event_ids.json');
const { eventIds } = JSON.parse(readFileSync(eventIdsPath, 'utf8'));

export default async function handler(req, res) {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body
  });

  const { address } = req.query;

  if (!address) {
    console.error('Address is missing in the request');
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    console.log(`Fetching POAPs for address: ${address}`);
    const poapResponse = await axios.get(`https://api.poap.tech/actions/scan/${address}`, {
      headers: {
        'X-API-Key': process.env.POAP_API_KEY
      }
    });

    console.log('POAP API response:', JSON.stringify(poapResponse.data, null, 2));

    if (poapResponse.status !== 200) {
      throw new Error(`Failed to fetch POAPs: ${poapResponse.statusText}`);
    }

    const allPoaps = poapResponse.data;
    console.log('Fetched POAPs:', JSON.stringify(allPoaps, null, 2));

    const requiredPoaps = allPoaps.filter(poap => eventIds.includes(poap.event.id.toString()));
    const missingEventIds = eventIds.filter(id => !requiredPoaps.some(poap => poap.event.id.toString() === id));

    if (requiredPoaps.length > 0) {
      console.log(`Required POAPs found for address ${address}:`, JSON.stringify(requiredPoaps, null, 2));
      res.status(200).json({
        poaps: requiredPoaps,
        missingEventIds: missingEventIds,
        message: `Found ${requiredPoaps.length} out of ${eventIds.length} required POAPs.`
      });
    } else {
      console.log(`No required POAPs found for address ${address}`);
      res.status(200).json({
        poaps: [],
        missingEventIds: eventIds,
        message: "No required POAPs found for this address."
      });
    }
  } catch (error) {
    console.error("Error fetching POAP data:", error);
    console.error("Full error details:", {
      message: error.message,
      stack: error.stack,
      request: error.config ? {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
        params: error.config.params
      } : 'No request config',
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data
      } : 'No response data'
    });

    let errorMessage = 'Failed to fetch POAP data. Please try again.';
    let statusCode = 500;

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = 'No POAPs found for this address.';
        statusCode = 404;
      } else if (error.response.status === 401) {
        errorMessage = 'Unauthorized access to POAP data. Please check API credentials.';
        statusCode = 401;
      }
    } else if (error.request) {
      errorMessage = 'No response received from POAP API. Please try again later.';
    }

    res.status(statusCode).json({ error: errorMessage, details: error.message });
  }
}
