import React, { useState } from 'react';
import { useEnsName, useEnsAddress } from 'wagmi';

const IdentityVerification: React.FC<{ onVerified: (address: string) => void }> = ({ onVerified }) => {
  const [inputAddress, setInputAddress] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const { data: ensName } = useEnsName({ address: inputAddress as `0x${string}` });
  const { data: ensAddress } = useEnsAddress({ name: inputAddress });

  const handleVerify = async () => {
    setIsVerifying(true);
    setError('');

    try {
      let verifiedAddress = inputAddress;

      if (inputAddress.endsWith('.eth')) {
        if (!ensAddress) {
          throw new Error('Invalid ENS name');
        }
        verifiedAddress = ensAddress;
      } else if (!inputAddress.startsWith('0x')) {
        throw new Error('Invalid Ethereum address format');
      }

      // Additional checks can be added here (e.g., checksum validation)

      onVerified(verifiedAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Identity Verification</h2>
      <p className="mb-4">Please enter your ENS name or Ethereum address:</p>
      <input
        type="text"
        value={inputAddress}
        onChange={(e) => setInputAddress(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="vitalik.eth or 0x..."
      />
      {ensName && <p className="mb-2">Resolved ENS Name: {ensName}</p>}
      {ensAddress && <p className="mb-2">Resolved Address: {ensAddress}</p>}
      <button
        onClick={handleVerify}
        disabled={isVerifying || !inputAddress}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {isVerifying ? 'Verifying...' : 'Verify'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default IdentityVerification;
