import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { type HttpTransport, PublicClient, WalletClient } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

type JsonRpcProvider = ethers.providers.JsonRpcProvider;
type JsonRpcSigner = ethers.providers.JsonRpcSigner;

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;

  if (!chain) {
    throw new Error("Chain not found");
  }

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback") {
    const providers = (transport.transports as ReturnType<HttpTransport>[]).map(
      ({ value }) => new ethers.providers.JsonRpcProvider(value?.url, network),
    );
    if (providers.length === 1) return providers[0];
    return new ethers.providers.FallbackProvider(providers);
  }
  return new ethers.providers.JsonRpcProvider(transport.url, network);
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;

  if (!chain) {
    throw new Error("Chain not found");
  }

  if (!account) {
    throw new Error("Account not found");
  }

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.providers.Web3Provider(transport as any, network);
  return provider.getSigner(account.address);
}

export function useSigner() {
  const { data: walletClient } = useWalletClient();

  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  useEffect(() => {
    async function getSigner() {
      if (!walletClient) return;

      const tmpSigner = walletClientToSigner(walletClient);

      setSigner(tmpSigner);
    }

    getSigner();
  }, [walletClient]);
  return signer;
}

export function useProvider() {
  const publicClient = usePublicClient();

  const [provider, setProvider] = useState<JsonRpcProvider | undefined>(undefined);
  useEffect(() => {
    async function getSigner() {
      if (!publicClient) return;

      const tmpProvider = publicClientToProvider(publicClient);

      setProvider(tmpProvider as unknown as JsonRpcProvider);
    }

    getSigner();
  }, [publicClient]);
  return provider;
}
