import React, { useState } from 'react';
import IdentityVerification from '../components/IdentityVerification';
import EventAttendanceVerification from '../components/EventAttendanceVerification';
import CrossChainTransfer from '../components/CrossChainTransfer';
import OnchainAttestation from '../components/OnchainAttestation';

const stages = ['identity', 'attendance', 'transfer', 'attestation', 'complete'] as const;
type Stage = typeof stages[number];

const Home: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('identity');
  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);

  const handleStageCompletion = (stage: Stage) => {
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'identity':
        return (
          <IdentityVerification
            onVerified={(address) => {
              setVerifiedAddress(address);
              handleStageCompletion('identity');
            }}
          />
        );
      case 'attendance':
        return (
          <EventAttendanceVerification
            onVerified={() => handleStageCompletion('attendance')}
          />
        );
      case 'transfer':
        return (
          <CrossChainTransfer
            onTransferComplete={() => handleStageCompletion('transfer')}
          />
        );
      case 'attestation':
        return (
          <OnchainAttestation
            onAttestationComplete={() => handleStageCompletion('attestation')}
          />
        );
      case 'complete':
        return (
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Mission Enrolment Complete!</h2>
            <p>Congratulations! You have successfully completed all stages of the mission enrolment.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mission Enrolment 2024</h1>
      {renderCurrentStage()}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Progress:</h3>
        <ul className="list-disc pl-5">
          {stages.map((stage, index) => (
            <li
              key={stage}
              className={`${
                index <= stages.indexOf(currentStage)
                  ? 'text-green-500'
                  : 'text-gray-400'
              }`}
            >
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
              {index < stages.indexOf(currentStage) && ' ✓'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
