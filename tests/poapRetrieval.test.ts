import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchPoaps } from '../components/POAPDataRetrieval';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    NEXT_PUBLIC_GNOSIS_API_KEY: 'dummy_gnosis_api_key',
  },
}));

describe('POAP Data Retrieval', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should fetch POAPs from Gnosis network', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    const mockGnosisResponse = {
      status: '1',
      message: 'OK',
      result: [
        {
          tokenID: '123456',
          tokenName: 'ETHGlobal Brussels 2024',
        },
      ],
    };

    const mockPoapMetadata = {
      id: '123456',
      name: 'ETHGlobal Brussels 2024',
      image_url: 'https://example.com/poap.png',
      start_date: '2024-03-15',
    };

    // Mock Gnosis API response
    mock.onGet(/api\.gnosisscan\.io/).reply(200, mockGnosisResponse);

    // Mock POAP metadata response
    mock.onGet(/api\.poap\.xyz/).reply(200, mockPoapMetadata);

    const result = await fetchPoaps(userAddress);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      event: {
        id: '123456',
        name: 'ETHGlobal Brussels 2024',
        image_url: 'https://example.com/poap.png',
        start_date: '2024-03-15',
      },
      token_id: '123456',
    });
  });

  it('should handle errors from Gnosis API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    mock.onGet(/api\.gnosisscan\.io/).reply(400, { status: '0', message: 'Error' });

    await expect(fetchPoaps(userAddress)).rejects.toThrow('Gnosis API error: Error');
  });

  it('should handle empty response from Gnosis API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    mock.onGet(/api\.gnosisscan\.io/).reply(200, { status: '1', message: 'OK', result: [] });

    const result = await fetchPoaps(userAddress);
    expect(result).toHaveLength(0);
  });
});
