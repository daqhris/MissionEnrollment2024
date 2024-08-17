import React, { useEffect, useState } from "react";
import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import EventAttendanceProof from "../components/EventAttendanceVerification";
import IdentityVerification from "../components/IdentityVerification";
import OnchainAttestation from "../components/OnchainAttestation";
import VerifiedENSNameDisplay from "../components/VerifiedENSNameDisplay";
import WalletConnectionGuide from "../components/WalletConnectionGuide";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";

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

const stageDescriptions: Record<Stage, string> = {
  identity: "Verify your identity using ENS or Ethereum address",
  attendance: "Confirm your attendance proof for ETHGlobal Brussels 2024",
  attestation: "Create an onchain attestation of your mission enrollment",
  complete: "Mission enrollment completed successfully",
};

const Home: FC = () => {
  const { address } = useAccount();
  const [currentStage, setCurrentStage] = useState<Stage>("identity");
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);
  const [poaps, setPoaps] = useState<POAPEvent[]>([]);
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => {
    if (completedStages.length === 0 && currentStage !== "identity") {
      setCurrentStage("identity");
    }
  }, [completedStages, currentStage]);

  const handleStageCompletion = (stage: Stage) => {
    setCompletedStages(prev => {
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
            onVerified={() => {
              handleStageCompletion("identity");
            }}
          />
        );
      case "attendance":
        return (
          <EventAttendanceProof
            onVerified={() => handleStageCompletion("attendance")}
            setPoaps={setPoaps}
            userAddress={address || ""}
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
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-gray-100 to-blue-100 text-gray-900"
      }`}
    >
      <header className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={60} height={60} className="mr-3 float-animation" />
            <h1
              className={`text-3xl font-bold bg-clip-text text-transparent ${
                theme === "dark"
                  ? "bg-gradient-to-r from-blue-400 to-purple-500"
                  : "bg-gradient-to-r from-blue-600 to-purple-700"
              }`}
            >
              Mission Enrollment
            </h1>
          </div>
          <nav className="flex items-center">
            <Link
              href="/recent"
              className={`mr-4 transition-colors btn btn-ghost ${
                theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
              }`}
            >
              Recent Activities
            </Link>
            <Link
              href="/blockExplorer"
              className={`mr-4 transition-colors btn btn-ghost ${
                theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
              }`}
            >
              Block Explorer
            </Link>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                theme === "dark" ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-800"
              }`}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className={`mb-12 p-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg card`}>
            <h2
              className={`text-2xl font-semibold mb-4 ${
                theme === "dark" ? "text-gradient-light" : "text-gradient-dark"
              }`}
            >
              Current Stage: {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)}
            </h2>
            <p className={`text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              {stageDescriptions[currentStage]}
            </p>
            <p className={`mt-4 text-md ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
              Complete this stage to proceed to the next step of your mission enrollment.
            </p>
          </div>
          <WalletConnectionGuide theme={theme || "light"} />
          <div className="mb-12">{renderCurrentStage()}</div>
          <div className="mt-12">
            <h3
              className={`text-2xl font-semibold mb-6 ${
                theme === "dark" ? "text-gradient-light" : "text-gradient-dark"
              }`}
            >
              Mission Progress:
            </h3>
            <div
              className={`w-full rounded-full h-6 mb-6 overflow-hidden ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(completedStages.length / stages.length) * 100}%` }}
              />
            </div>
            <ul className="space-y-6">
              {stages.map((stage, index) => (
                <li
                  key={stage}
                  className={`flex items-center p-6 rounded-xl shadow-lg transition-all duration-300 ${
                    isStageAccessible(stage)
                      ? `${
                          theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"
                        } border-l-4 border-blue-500 cursor-pointer card`
                      : `${
                          theme === "dark" ? "bg-gray-800 text-gray-500" : "bg-gray-200 text-gray-600"
                        } cursor-not-allowed opacity-60`
                  }`}
                  onClick={() => {
                    if (isStageAccessible(stage)) {
                      setCurrentStage(stage);
                    }
                  }}
                >
                  <span className="mr-6 text-3xl">
                    {completedStages.includes(stage) ? "✅" : currentStage === stage ? "🔵" : `${index + 1}`}
                  </span>
                  <div>
                    <span className="font-semibold text-xl">{stage.charAt(0).toUpperCase() + stage.slice(1)}</span>
                    <p className={`text-md mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {stageDescriptions[stage]}
                    </p>
                    {currentStage === stage && (
                      <p className={`text-sm mt-3 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                        You are here - complete this stage to proceed.
                      </p>
                    )}
                    {!isStageAccessible(stage) && (
                      <p className={`text-sm mt-3 ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                        Complete previous stages to unlock.
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {address && (
            <div className={`mt-8 p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg`}>
              <h3
                className={`text-xl font-semibold mb-4 ${
                  theme === "dark" ? "text-gradient-light" : "text-gradient-dark"
                }`}
              >
                Connected Wallet:
              </h3>
              <VerifiedENSNameDisplay address={address} theme={theme || "light"} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
