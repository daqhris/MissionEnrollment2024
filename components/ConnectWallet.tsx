import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ConnectWallet: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err) {
        console.error('Failed to get accounts:', err);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        setError(null);
      } catch (err) {
        console.error('Failed to connect wallet:', err);
        setError('Failed to connect wallet. Please try again.');
      }
    } else {
      setError('Please install MetaMask or another Ethereum wallet provider.');
    }
  };

  return (
    <div className="connect-wallet">
      {walletAddress ? (
        <p>Connected: {walletAddress}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ConnectWallet;
