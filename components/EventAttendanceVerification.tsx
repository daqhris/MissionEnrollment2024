import React, { useState, useEffect } from 'react';
import { useAccount, useEnsName } from 'wagmi';

interface POAPEvent {
  id: string;
  name: string;
  city: string;
  country: string;
  start_date: string;
  end_date: string;
  image_url: string;
}

const API_KEY = 'YOUR_API_KEY_HERE';
const API_BASE_URL = 'https://api.poap.tech';

const EventAttendanceVerification: React.FC<{ onVerified: () => void }> = ({ onVerified }) => {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [poaps, setPOAPs] = useState<POAPEvent[]>([]);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (address) {
      fetchPOAPs();
    }
  }, [address]);

  const fetchPOAPs = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}/actions/scan/${address}`, {
        headers: {
          'X-API-Key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch POAPs: ${response.statusText}`);
      }
      const data = await response.json();
      const ethGlobalPOAPs = data.filter((poap: POAPEvent) =>
        poap.name.toLowerCase().includes('ethglobal') &&
        poap.city.toLowerCase() === 'brussels'
      );
      setPOAPs(ethGlobalPOAPs);
    } catch (error) {
      console.error('Error fetching POAPs:', error);
      setVerificationResult('Failed to verify POAPs. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerify = () => {
    if (poaps.length > 0) {
      setVerificationResult(`Verification successful! ${ensName || address} has attended an ETHGlobal event in Brussels.`);
      onVerified();
    } else {
      setVerificationResult(`Verification failed. No eligible POAPs found for ${ensName || address} at ETHGlobal events in Brussels.`);
    }
  };

  const handleImageError = (poapId: string) => {
    setImageLoadErrors(prev => ({ ...prev, [poapId]: true }));
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Event Attendance Verification</h2>
      <p className="mb-4">Verify your attendance at an ETHGlobal event in Brussels:</p>
      {isVerifying ? (
        <p>Verifying POAPs for {ensName || address}...</p>
      ) : (
        <>
          <button
            onClick={handleVerify}
            disabled={poaps.length === 0}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Verify Attendance
          </button>
          {poaps.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Eligible POAPs:</h3>
              <ul className="list-none pl-0">
                {poaps.map((poap) => (
                  <li key={poap.id} className="flex items-center mb-2">
                    {!imageLoadErrors[poap.id] ? (
                      <img
                        src={poap.image_url}
                        alt={poap.name}
                        className="w-12 h-12 mr-2 rounded"
                        onError={() => handleImageError(poap.id)}
                      />
                    ) : (
                      <div className="w-12 h-12 mr-2 rounded bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{poap.name}</p>
                      <p className="text-sm text-gray-600">{new Date(poap.start_date).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      {verificationResult && (
        <p className={`mt-4 ${verificationResult.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
          {verificationResult}
        </p>
      )}
    </div>
  );
};

export default EventAttendanceVerification;
