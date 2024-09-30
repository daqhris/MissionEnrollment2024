const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { verifyPOAPOwnership, verifyETHGlobalBrusselsPOAPOwnership } = require('../src/utils/poapVerification');

describe('POAP Verification', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const testAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
  const testEventId = '176334';

  test('verifyPOAPOwnership returns true when POAP is owned', async () => {
    mock.onGet(`https://api.poap.tech/actions/scan/${testAddress}/${testEventId}`).reply(200, [
      {
        event: {
          id: testEventId,
          name: 'ETHGlobal Brussels 2024',
          image_url: 'https://assets.poap.xyz/c5cb8bb2-e0ae-428e-bc77-c55d0dc8b02e.png',
        },
      },
    ]);

    const result = await verifyPOAPOwnership(testAddress, testEventId);
    expect(result).toBe(true);
  });

  test('verifyPOAPOwnership returns false when POAP is not owned', async () => {
    mock.onGet(`https://api.poap.tech/actions/scan/${testAddress}/${testEventId}`).reply(200, []);

    const result = await verifyPOAPOwnership(testAddress, testEventId);
    expect(result).toBe(false);
  });

  test('verifyPOAPOwnership handles API errors', async () => {
    mock.onGet(`https://api.poap.tech/actions/scan/${testAddress}/${testEventId}`).reply(500);

    const result = await verifyPOAPOwnership(testAddress, testEventId);
    expect(result).toBe(false);
  });

  test('verifyETHGlobalBrusselsPOAPOwnership returns true when at least one POAP is owned', async () => {
    mock.onGet(/https:\/\/api\.poap\.tech\/actions\/scan\/.*/).reply(200, []);
    mock.onGet(`https://api.poap.tech/actions/scan/${testAddress}/176328`).reply(200, [
      {
        event: {
          id: '176328',
          name: 'ETHGlobal Brussels 2024',
          image_url: 'https://assets.poap.xyz/7d38ca82-4fa6-41f4-b526-cfd1894e168b.png',
        },
      },
    ]);

    const result = await verifyETHGlobalBrusselsPOAPOwnership(testAddress);
    expect(result).toBe(true);
  });

  test('verifyETHGlobalBrusselsPOAPOwnership returns false when no POAPs are owned', async () => {
    mock.onGet(/https:\/\/api\.poap\.tech\/actions\/scan\/.*/).reply(200, []);

    const result = await verifyETHGlobalBrusselsPOAPOwnership(testAddress);
    expect(result).toBe(false);
  });
});
