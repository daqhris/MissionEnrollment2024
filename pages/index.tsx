import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IdentityVerification from '../components/IdentityVerification';
import EventAttendanceVerification from '../components/EventAttendanceVerification';
import CrossChainTransfer from '../components/CrossChainTransfer';
import OnchainAttestation from '../components/OnchainAttestation';

const stages = ['identity', 'attendance', 'transfer', 'attestation', 'complete'] as const;
type Stage = typeof stages[number];

const Home: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('identity');
  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Prevent direct access to later stages
    if (completedStages.length === 0 && currentStage !== 'identity') {
      setCurrentStage('identity');
    }
  }, [completedStages, currentStage]);

  const handleStageCompletion = (stage: Stage) => {
    setCompletedStages((prev) => [...prev, stage]);
    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  const isStageAccessible = (stage: Stage) => {
    const stageIndex = stages.indexOf(stage);
    return stageIndex <= completedStages.length;
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
                isStageAccessible(stage) ? 'text-green-500' : 'text-gray-400'
              } ${!isStageAccessible(stage) && 'cursor-not-allowed'}`}
              onClick={() => {
                if (isStageAccessible(stage)) {
                  setCurrentStage(stage);
                }
              }}
            >
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
              {completedStages.includes(stage) && ' ✓'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
