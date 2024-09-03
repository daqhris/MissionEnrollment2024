import { ethers } from 'ethers';

export const BLOCKSCOUT_API_URL = 'https://gnosis.blockscout.com/api';
export const POAP_CONTRACT_ADDRESS = '0x22C1f6050E56d2876009903609a2cC3fEf83B415';
export const GNOSIS_RPC_URL = 'https://rpc.gnosischain.com';

// POAP ABI (including necessary functions for Gnosis Chain integration)
export const POAP_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
] as const;

// Create a provider for the Gnosis Chain
export const gnosisProvider = new ethers.JsonRpcProvider(GNOSIS_RPC_URL);

// Create a contract instance
export const poapContract = new ethers.Contract(POAP_CONTRACT_ADDRESS, POAP_ABI, gnosisProvider);

// Function to safely interact with the POAP contract
export const safePoapContractCall = async <T>(
  method: keyof typeof poapContract,
  ...args: any[]
): Promise<T | null> => {
  try {
    if (poapContract && typeof poapContract[method] === 'function') {
      return await poapContract[method](...args);
    }
    return null;
  } catch (error) {
    console.error(`Error calling ${String(method)}:`, error);
    return null;
  }
};

// Export all constants and functions
export { ethers };
