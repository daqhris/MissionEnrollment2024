import React from "react";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

interface WalletConnectionGuideProps {
  theme: string;
}

const WalletConnectionGuide: React.FC<WalletConnectionGuideProps> = ({ theme }) => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const steps = [
    "Click the 'Connect Wallet' button above",
    "Choose your preferred wallet (e.g., MetaMask)",
    "Follow the wallet's prompts to connect",
    "Once connected, you'll see your address displayed",
  ];

  return (
    <div className={`p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg`}>
      <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
        Wallet Connection Guide
      </h2>
      {!isConnected ? (
        <>
          <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Follow these steps to connect your Ethereum wallet:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            {steps.map((step, index) => (
              <li key={index} className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <RainbowKitCustomConnectButton />
          </div>
        </>
      ) : (
        <div className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          <p>Your wallet is connected!</p>
          <button
            onClick={() => disconnect()}
            className={`mt-4 px-4 py-2 rounded ${
              theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
            } text-white transition-colors`}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
      <div className="mt-6">
        <Image
          src="/images/wallet-connection-guide.png"
          alt="Wallet Connection Visual Guide"
          width={300}
          height={200}
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default WalletConnectionGuide;
