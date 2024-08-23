import React, { type FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import EventAttendanceProof from "../components/EventAttendanceVerification";
import IdentityVerification from "../components/IdentityVerification";
import OnchainAttestation from "../components/OnchainAttestation";
import VerifiedENSNameDisplay from "../components/VerifiedENSNameDisplay";
import WalletConnectionGuide from "../components/WalletConnectionGuide";
import { useTheme } from "next-themes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const Home: FC = (): JSX.Element => {
  const { address } = useAccount();
  const [currentStage, setCurrentStage] = useState<Stage>("identity");
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);
  const [poaps, setPoaps] = useState<POAPEvent[]>([]);
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = (): void => setTheme(theme === "dark" ? "light" : "dark");

  useEffect((): void => {
    if (completedStages.length === 0 && currentStage !== "identity") {
      setCurrentStage("identity");
    }
  }, [completedStages, currentStage]);

  const handleStageCompletion = (stage: Stage): void => {
    setCompletedStages(prev => {
      const newCompletedStages = [...prev, stage];
      localStorage.setItem("completedStages", JSON.stringify(newCompletedStages));
      return newCompletedStages;
    });

    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      if (nextStage) {
        setCurrentStage(nextStage);
        localStorage.setItem("currentStage", nextStage);
      }
    }
  };

  const isStageAccessible = (stage: Stage): boolean => {
    const stageIndex = stages.indexOf(stage);
    return stageIndex <= completedStages.length;
  };

  const renderCurrentStage = (): JSX.Element | null => {
    switch (currentStage) {
      case "identity":
        return (
          <IdentityVerification
            onVerified={(): void => {
              handleStageCompletion("identity");
              toast.success("Identity verified successfully!");
            }}
          />
        );
      case "attendance":
        return (
          <EventAttendanceProof
            onVerified={(): void => {
              handleStageCompletion("attendance");
              toast.success("Attendance verified successfully!");
            }}
            setPoaps={setPoaps}
            userAddress={address || ""}
          />
        );
      case "attestation":
        return (
          <OnchainAttestation
            onAttestationComplete={(): void => {
              handleStageCompletion("attestation");
              toast.success("Attestation completed successfully!");
            }}
            poaps={poaps}
          />
        );
      case "complete":
        return (
          <div className="p-6 bg-gray-800 shadow-lg rounded-lg text-white animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Mission Enrollment Complete!</h2>
            <p>Congratulations! You have successfully completed all stages of the mission enrollment.</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              onClick={(): void => {
                toast.success("Thank you for completing the mission enrollment!");
              }}
            >
              Finish
            </button>
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
      />
      <header className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={60} height={60} className="mr-3 float-animation" />
            <h1
              className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
                theme === "dark" ? "from-blue-400 to-purple-500" : "from-blue-600 to-purple-700"
              }`}
            >
              Mission Enrollment
            </h1>
          </div>
          <nav className="flex items-center">
            <Link
              href="/recent"
              className={`mr-4 transition-colors btn btn-ghost hover:text-${
                theme === "dark" ? "blue-400" : "blue-600"
              }`}
            >
              Recent Activities
            </Link>
            <Link
              href="/blockExplorer"
              className={`mr-4 transition-colors btn btn-ghost hover:text-${
                theme === "dark" ? "blue-400" : "blue-600"
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
          <div className={`mb-12 p-8 rounded-xl shadow-lg card ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
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
                      ? `${theme === "dark" ? "bg-gray-800" : "bg-white"} hover:bg-${
                          theme === "dark" ? "gray-700" : "gray-100"
                        } border-l-4 border-blue-500 cursor-pointer card`
                      : `${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} text-${
                          theme === "dark" ? "gray-500" : "gray-600"
                        } cursor-not-allowed opacity-60`
                  }`}
                  onClick={(): void => {
                    if (isStageAccessible(stage)) {
                      setCurrentStage(stage);
                      toast.info(`Switched to ${stage} stage`);
                    } else {
                      toast.warning("Complete previous stages to unlock this stage");
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
            <div className={`mt-8 p-4 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
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
