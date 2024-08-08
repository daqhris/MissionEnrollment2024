import React, { useEffect, useState } from "react";
import CrossChainTransfer from "../components/CrossChainTransfer";
import EventAttendanceVerification from "../components/EventAttendanceVerification";
import IdentityVerification from "../components/IdentityVerification";
import OnchainAttestation from "../components/OnchainAttestation";

const stages = ["identity", "attendance", "transfer", "attestation", "complete"] as const;
type Stage = (typeof stages)[number];

const Home: React.FC = () => {
  console.log("Home component rendering");
  const [currentStage, setCurrentStage] = useState<Stage>("identity");
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);

  useEffect(() => {
    console.log("useEffect triggered. currentStage:", currentStage, "completedStages:", completedStages);
    // Prevent direct access to later stages
    if (completedStages.length === 0 && currentStage !== "identity") {
      console.log("Resetting to identity stage");
      setCurrentStage("identity");
    }
  }, [completedStages, currentStage]);

  const handleStageCompletion = (stage: Stage) => {
    console.log(`Completing stage: ${stage}`);
    setCompletedStages(prev => {
      const newCompletedStages = [...prev, stage];
      console.log(`Updated completedStages:`, newCompletedStages);
      return newCompletedStages;
    });
    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      console.log(`Setting next stage: ${nextStage}`);
      setCurrentStage(nextStage);
    }
  };

  const isStageAccessible = (stage: Stage) => {
    const stageIndex = stages.indexOf(stage);
    return stageIndex <= completedStages.length;
  };

  const renderCurrentStage = () => {
    console.log(`Rendering current stage: ${currentStage}`);
    console.log(`Completed stages:`, completedStages);
    switch (currentStage) {
      case "identity":
        console.log("Rendering IdentityVerification component");
        return (
          <IdentityVerification
            onVerified={() => {
              console.log("IdentityVerification onVerified callback triggered");
              handleStageCompletion("identity");
            }}
          />
        );
      case "attendance":
        console.log("Rendering EventAttendanceVerification component");
        return <EventAttendanceVerification onVerified={() => handleStageCompletion("attendance")} />;
      case "transfer":
        console.log("Rendering CrossChainTransfer component");
        return <CrossChainTransfer onTransferComplete={() => handleStageCompletion("transfer")} />;
      case "attestation":
        console.log("Rendering OnchainAttestation component");
        return <OnchainAttestation onAttestationComplete={() => handleStageCompletion("attestation")} />;
      case "complete":
        console.log("Rendering completion message");
        return (
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Mission Enrolment Complete!</h2>
            <p>Congratulations! You have successfully completed all stages of the mission enrolment.</p>
          </div>
        );
      default:
        console.log("No matching stage found");
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mission Enrolment 2024</h1>
      {renderCurrentStage()}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Progress:</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(completedStages.length / stages.length) * 100}%` }}
          ></div>
        </div>
        <ul className="space-y-2">
          {stages.map(stage => (
            <li
              key={stage}
              className={`flex items-center p-2 rounded ${
                isStageAccessible(stage)
                  ? "bg-green-100 text-green-800 cursor-pointer hover:bg-green-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => {
                if (isStageAccessible(stage)) {
                  console.log(`Clicked on stage: ${stage}`);
                  setCurrentStage(stage);
                }
              }}
            >
              <span className="mr-2">
                {completedStages.includes(stage)
                  ? "✅"
                  : currentStage === stage
                    ? "🔵"
                    : "⚪"}
              </span>
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
