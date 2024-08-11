import axios from 'axios';

export default async function handler(req, res) {
  const { address } = req.query;
  const eventId = '16947'; // ETHGlobal Brussels 2024 event ID

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    console.log(`Fetching POAP event data for event ID: ${eventId}`);
    const eventResponse = await axios.get(`https://api.poap.tech/events/id/${eventId}`, {
      headers: {
        'X-API-Key': process.env.POAP_API_KEY
      }
    });

    console.log('POAP event API response:', eventResponse.data);

    if (eventResponse.status !== 200) {
      throw new Error(`Failed to fetch POAP event: ${eventResponse.statusText}`);
    }

    const eventData = eventResponse.data;

    console.log(`Verifying POAP ownership for address: ${address}`);
    const ownershipResponse = await axios.get(`https://api.poap.tech/actions/scan/${address}`, {
      headers: {
        'X-API-Key': process.env.POAP_API_KEY
      }
    });

    console.log('POAP ownership API response:', ownershipResponse.data);

    if (ownershipResponse.status !== 200) {
      throw new Error(`Failed to verify POAP ownership: ${ownershipResponse.statusText}`);
    }

    const ownedPOAPs = ownershipResponse.data;
    console.log('Owned POAPs:', ownedPOAPs);

    const hasPOAP = ownedPOAPs.some(poap => poap.event.id === parseInt(eventId));

    if (hasPOAP) {
      console.log(`POAP found for address ${address}`);
      res.status(200).json({ poaps: [eventData], message: `Proof successful! ${address} has attended ETHGlobal Brussels 2024.` });
    } else {
      console.log(`No POAP found for address ${address}`);
      res.status(200).json({ poaps: [], message: "No eligible POAP found for ETHGlobal Brussels 2024." });
    }
  } catch (error) {
    console.error("Error fetching POAP data:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response data'
    });
    res.status(500).json({ error: 'Failed to fetch POAP data. Please try again.', details: error.message });
  }
}
