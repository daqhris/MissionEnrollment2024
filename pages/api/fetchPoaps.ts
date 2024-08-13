import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const POAP_API_URL = 'https://api.poap.xyz/actions/scan';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Invalid address provided' });
  }

  try {
    const response = await axios.get(`${POAP_API_URL}/${address}`);
    const poaps = response.data;

    return res.status(200).json({ poaps });
  } catch (error) {
    console.error('Error fetching POAPs:', error);
    return res.status(500).json({ error: 'Error fetching POAPs' });
  }
}
