import { RainbowKitCustomConnectButton } from "./scaffold-eth";

interface WalletConnectionGuideProps {
  theme: string;
}

const WalletConnectionGuide = ({ theme }: WalletConnectionGuideProps) => {
  return (
    <div className={`p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg`}>
      <div className="mt-6">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};

export default WalletConnectionGuide;
