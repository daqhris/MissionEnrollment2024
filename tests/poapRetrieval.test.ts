const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { fetchPoaps } = require('../utils/fetchPoapsUtil');

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    NEXT_PUBLIC_GNOSIS_API_KEY: 'dummy_gnosis_api_key',
  },
}));

describe('POAP Data Retrieval', () => {
  let mock: typeof MockAdapter;

  beforeEach(async () => {
    // Create a new instance of MockAdapter for each test
    mock = new MockAdapter(axios);

    // Mock the axios.create method to return an instance that uses our mock adapter
    jest.spyOn(axios, 'create').mockImplementation(() => {
      return axios;
    });

    // Ensure the POAP API key is set in the environment
    process.env.NEXT_PUBLIC_POAP_API_KEY = 'dummy_poap_api_key';

    // Mock the POAP API endpoint
    mock.onGet(/https:\/\/api\.poap\.xyz\/actions\/scan\/.*/).reply(async (config: any) => {
      if (config.headers && config.headers['X-API-Key'] === process.env.NEXT_PUBLIC_POAP_API_KEY) {
        return [200, [{ event: { id: '123456', name: 'ETHGlobal Brussels 2024', image_url: 'https://example.com/poap.png', start_date: '2024-03-15' }, token_id: '123456' }]];
      }
      return [401, { error: 'Unauthorized' }];
    });
  });

  afterEach(async () => {
    await mock.reset();
    await jest.restoreAllMocks();
  });

  it('should fetch POAPs from POAP API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    const mockPoapMetadata = {
      id: '123456',
      fancy_id: 'ethglobal-brussels-2024',
      name: 'ETHGlobal Brussels 2024',
      event: {
        id: '123456',
        fancy_id: 'ethglobal-brussels-2024',
        name: 'ETHGlobal Brussels 2024',
        event_url: 'https://ethglobal.com/events/brussels',
        image_url: 'https://example.com/poap.png',
        country: 'Belgium',
        city: 'Brussels',
        description: 'ETHGlobal Brussels 2024 event',
        year: 2024,
        start_date: '2024-03-15',
        end_date: '2024-03-17',
        expiry_date: '2024-04-15',
        supply: 1000,
      },
      token_id: '123456',
    };

    // Ensure environment variables are set
    process.env.NEXT_PUBLIC_POAP_API_KEY = 'dummy_poap_api_key';

    // Mock POAP API response
    mock.onGet(`https://api.poap.xyz/actions/scan/${userAddress}`).reply(async (config: any) => {
      console.log('Mock POAP API request received:', {
        url: config.url,
        params: config.params,
        headers: config.headers,
      });
      if (
        config.params &&
        config.params.chain === 'gnosis' &&
        config.params.limit === 100 &&
        config.headers &&
        config.headers['X-API-Key'] === process.env.NEXT_PUBLIC_POAP_API_KEY
      ) {
        return [200, [mockPoapMetadata]];
      }
      console.log('Mock POAP API request failed:', config);
      return [404, { error: 'Not found' }];
    });

    const result = await fetchPoaps(userAddress);

    console.log('Actual API request details:', mock.history.get?.map((req: any) => ({
      url: req.url,
      params: req.params,
      headers: req.headers,
    })) || []);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      event: {
        id: '123456',
        name: 'ETHGlobal Brussels 2024',
        image_url: 'https://example.com/poap.png',
        start_date: '2024-03-15',
      },
      token_id: '123456',
      metadata: {
        image: 'https://example.com/poap.png',
      },
    });

    // Log the mock calls for debugging
    console.log('Mock calls:', JSON.stringify(mock.history.get, null, 2));
  });

  it('should handle API errors from POAP API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    mock.onGet(/https:\/\/api\.poap\.xyz\/actions\/scan\/.*/).networkError();

    await expect(fetchPoaps(userAddress)).rejects.toThrow('An error occurred while fetching POAP data');
  });

  it('should handle empty response from POAP API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    mock.onGet(/https:\/\/api\.poap\.xyz\/actions\/scan\/.*/).reply(200, []);

    const result = await fetchPoaps(userAddress);
    expect(result).toEqual([]);
  });

  it('should handle invalid response format from POAP API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    mock.onGet(/https:\/\/api\.poap\.xyz\/actions\/scan\/.*/).reply(200, { invalid: 'response' });

    await expect(fetchPoaps(userAddress)).rejects.toThrow('POAP API error: Invalid response format');
  });

  it('should handle null response from POAP API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    mock.onGet(/https:\/\/api\.poap\.xyz\/actions\/scan\/.*/).reply(200, null);

    const result = await fetchPoaps(userAddress);
    expect(result).toEqual([]);
  });
});
