import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface POAPEvent {
  id: string;
  name: string;
  city: string;
  country: string;
  start_date: string;
  end_date: string;
}

const EventAttendanceVerification: React.FC<{ onVerified: () => void }> = ({ onVerified }) => {
  const { address } = useAccount();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [poaps, setPOAPs] = useState<POAPEvent[]>([]);

  useEffect(() => {
    if (address) {
      fetchPOAPs();
    }
  }, [address]);

  const fetchPOAPs = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch(`https://api.poap.xyz/actions/scan/${address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch POAPs');
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
      setVerificationResult('Verification successful! You have attended an ETHGlobal event in Brussels.');
      onVerified();
    } else {
      setVerificationResult('Verification failed. No eligible POAPs found for ETHGlobal events in Brussels.');
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Event Attendance Verification</h2>
      <p className="mb-4">Verify your attendance at an ETHGlobal event in Brussels:</p>
      {isVerifying ? (
        <p>Verifying POAPs...</p>
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
              <ul className="list-disc pl-5">
                {poaps.map((poap) => (
                  <li key={poap.id}>{poap.name} - {poap.start_date}</li>
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
