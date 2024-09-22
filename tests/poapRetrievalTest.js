const getMockPoapApiResponse = require('./mockPoapApiResponse');

const testAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';

async function testPOAPRetrieval() {
  console.log('Starting POAP retrieval test...');

  try {
    console.log('Fetching POAPs...');
    const startTime = Date.now();

    const response = await getMockPoapApiResponse();

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (!Array.isArray(response)) {
      throw new Error('POAP API error: Invalid response format');
    }

    const fetchedPoaps = response
      .filter(poap => poap.event && poap.event.id)
      .map(poap => ({
        event: {
          id: poap.event.id,
          name: poap.event.name || "Unknown Event",
          image_url: poap.event.image_url || "",
          start_date: poap.event.start_date || '',
        },
        token_id: poap.tokenId,
      }));

    console.log(`Retrieved ${fetchedPoaps.length} POAPs in ${duration}ms`);
    console.log('Sample POAP:', fetchedPoaps[0]);

    const ethGlobalBrusselsPOAP = fetchedPoaps.find(
      poap => poap.event.name.toLowerCase() === "ethglobal brussels 2024"
    );

    if (ethGlobalBrusselsPOAP) {
      console.log('ETHGlobal Brussels 2024 POAP found:', ethGlobalBrusselsPOAP);
    } else {
      console.log('ETHGlobal Brussels 2024 POAP not found');
    }

  } catch (error) {
    console.error('Error during POAP retrieval test:', error.message);
  }
}

testPOAPRetrieval();
