import React, { useEffect, useState } from "react";
import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import EventAttendanceProof from "../components/EventAttendanceVerification";
import IdentityVerification from "../components/IdentityVerification";
import OnchainAttestation from "../components/OnchainAttestation";
import POAPShowcase from "../components/POAPShowcase";

const stages = ["identity", "attendance", "attestation", "complete"] as const;
type Stage = (typeof stages)[number];

interface POAPEvent {
  event: {
    id: string;
    name: string;
    image_url: string;
    start_date: string;
  };
  token_id: string;
}

const stageDescriptions = {
  identity: "Verify your identity using ENS or Ethereum address",
  attendance: "Confirm your attendance proof for ETHGlobal Brussels 2024",
  attestation: "Create an onchain attestation of your mission enrollment",
  complete: "Mission enrollment completed successfully",
};

const Home: FC = () => {
  const [currentStage, setCurrentStage] = useState<Stage>("identity");
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);
  const [poaps, setPoaps] = useState<Array<POAPEvent>>([]);
  const [userAddress, setUserAddress] = useState<string>("");

  useEffect(() => {
    if (completedStages.length === 0 && currentStage !== "identity") {
      setCurrentStage("identity");
    }
  }, [completedStages, currentStage, setCurrentStage]);

  const handleStageCompletion = (stage: Stage) => {
    setCompletedStages((prev: Stage[]) => {
      const newCompletedStages = [...prev, stage];
      localStorage.setItem("completedStages", JSON.stringify(newCompletedStages));
      return newCompletedStages;
    });

    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setCurrentStage(nextStage);
      localStorage.setItem("currentStage", nextStage);
    }
  };

  const isStageAccessible = (stage: Stage) => {
    const stageIndex = stages.indexOf(stage);
    return stageIndex <= completedStages.length;
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case "identity":
        return (
          <IdentityVerification
            onVerified={(address: string) => {
              setUserAddress(address);
              handleStageCompletion("identity");
            }}
          />
        );
      case "attendance":
        return (
          <EventAttendanceProof
            onVerified={() => handleStageCompletion("attendance")}
            setPoaps={(poaps: POAPEvent[]) => setPoaps(poaps)}
            userAddress={userAddress}
          />
        );
      case "attestation":
        return <OnchainAttestation onAttestationComplete={() => handleStageCompletion("attestation")} poaps={poaps} />;
      case "complete":
        return (
          <div className="p-6 bg-gray-800 shadow-lg rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Mission Enrollment Complete!</h2>
            <p>Congratulations! You have successfully completed all stages of the mission enrollment.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="mr-2" />
            <h1 className="text-2xl font-bold">Mission Enrollment 2024</h1>
          </div>
          <nav>
            <Link href="/recent" className="mr-4 hover:text-blue-400 transition-colors">
              Recent Activities
            </Link>
            <Link href="/blockExplorer" className="hover:text-blue-400 transition-colors">
              Block Explorer
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">
              Current Stage: {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)}
            </h2>
            <p className="text-lg text-gray-300">{stageDescriptions[currentStage]}</p>
            <p className="mt-2 text-sm text-blue-400">
              Complete this stage to proceed to the next step of your mission enrollment.
            </p>
          </div>
          {renderCurrentStage()}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Mission Progress:</h3>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(completedStages.length / stages.length) * 100}%` }}
              />
            </div>
            <ul className="space-y-4">
              {stages.map((stage, index) => (
                <li
                  key={stage}
                  className={`flex items-center p-4 rounded-lg shadow-md transition-all duration-300 ${
                    isStageAccessible(stage)
                      ? "bg-gray-800 border-l-4 border-blue-500 cursor-pointer hover:bg-gray-700"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (isStageAccessible(stage)) {
                      setCurrentStage(stage);
                    }
                  }}
                >
                  <span className="mr-4 text-2xl">
                    {completedStages.includes(stage) ? "✅" : currentStage === stage ? "🔵" : `${index + 1}`}
                  </span>
                  <div>
                    <span className="font-semibold text-lg">{stage.charAt(0).toUpperCase() + stage.slice(1)}</span>
                    <p className="text-sm mt-1 text-gray-400">{stageDescriptions[stage]}</p>
                    {currentStage === stage && (
                      <p className="text-xs mt-2 text-blue-400">You are here - complete this stage to proceed.</p>
                    )}
                    {!isStageAccessible(stage) && (
                      <p className="text-xs mt-2 text-gray-500">Complete previous stages to unlock.</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {poaps.length > 0 && <POAPShowcase poaps={poaps} />}
        </div>
      </main>
    </div>
  );
};

export default Home;
