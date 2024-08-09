// Removed unused imports

const mockPoapData = [
  {
    event: {
      id: 1,
      name: "ETHGlobal Brussels 2024",
      description: "Hackathon event in Brussels",
      start_date: "2024-03-15",
      end_date: "2024-03-17",
      city: "Brussels",
    },
    tokenId: "12345",
    owner: "0x1234567890123456789012345678901234567890",
    chain: "gnosis",
    created: "2024-03-17T12:00:00Z",
    imageUrl: "https://placehold.co/150x150?text=POAP+1",
  },
  {
    event: {
      id: 2,
      name: "ETHGlobal Paris 2023",
      description: "Ethereum conference in Paris",
      start_date: "2023-07-21",
      end_date: "2023-07-23",
      city: "Paris",
    },
    tokenId: "67890",
    owner: "0x1234567890123456789012345678901234567890",
    chain: "gnosis",
    created: "2023-07-23T18:30:00Z",
    imageUrl: "https://placehold.co/150x150?text=POAP+2",
  },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: "Address parameter is required" });
    }

    // Simulate network delay
    setTimeout(() => {
      // Simulate error for testing (10% chance)
      // if (Math.random() < 0.1) {
      //   console.error('Simulated API error');
      //   return res.status(500).json({ error: 'Internal Server Error' });
      // }

      console.log(`Fetching POAPs for address: ${address}`);
      res.status(200).json(mockPoapData);
    }, 1000);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
