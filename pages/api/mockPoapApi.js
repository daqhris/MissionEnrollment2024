import { NextApiRequest, NextApiResponse } from 'next';

const mockPoapData = [
  {
    event: {
      id: 1,
      name: "ETHGlobal Brussels 2024",
      description: "Hackathon event in Brussels",
      start_date: "2024-03-15",
      end_date: "2024-03-17",
      city: "Brussels"
    },
    tokenId: "12345",
    owner: "0x1234567890123456789012345678901234567890",
    chain: "gnosis",
    created: "2024-03-17T12:00:00Z"
  },
  {
    event: {
      id: 2,
      name: "ETHGlobal Paris 2023",
      description: "Ethereum conference in Paris",
      start_date: "2023-07-21",
      end_date: "2023-07-23",
      city: "Paris"
    },
    tokenId: "67890",
    owner: "0x1234567890123456789012345678901234567890",
    chain: "gnosis",
    created: "2023-07-23T18:30:00Z"
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    // In a real scenario, we would filter POAPs based on the address
    // For this mock, we're returning all POAPs regardless of the address
    res.status(200).json(mockPoapData);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
