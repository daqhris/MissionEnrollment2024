const mockPoapApiResponse = [
  {
    event: {
      id: '123456',
      name: 'ETHGlobal Brussels 2024',
      image_url: 'https://example.com/poap-image.png',
      start_date: '2024-03-15',
    },
    tokenId: '789012',
  },
  {
    event: {
      id: '234567',
      name: 'Another Event',
      image_url: 'ipfs://QmExample123456789',
      start_date: '2024-02-01',
    },
    tokenId: '890123',
  },
];

function getMockPoapApiResponse() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPoapApiResponse);
    }, 500); // Simulate a 500ms delay
  });
}

module.exports = getMockPoapApiResponse;
