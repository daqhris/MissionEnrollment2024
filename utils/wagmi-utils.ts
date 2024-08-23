import { useCallback, useEffect, useState } from "react";
import { BrowserProvider, FallbackProvider, JsonRpcProvider, JsonRpcSigner } from "ethers";
import type { Eip1193Provider, Provider, Networkish } from "ethers";
import type { HttpTransport, PublicClient, WalletClient } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

export function publicClientToProvider(publicClient: PublicClient): Provider {
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
      ({ value }) => new JsonRpcProvider(value?.url, network as Networkish),
    );
    if (providers.length === 1) return providers[0] as Provider;
    return new FallbackProvider(providers);
  }
  return new JsonRpcProvider(transport.url, network as Networkish);
}

export async function walletClientToSigner(walletClient: WalletClient): Promise<JsonRpcSigner> {
  const { account, chain, transport } = walletClient;

  if (!chain) throw new Error("Chain not found");
  if (!account) throw new Error("Account not found");

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network as Networkish);
  return provider.getSigner(account.address);
}

export function useSigner(): JsonRpcSigner | undefined {
  const { data: walletClient } = useWalletClient();
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);

  const getSigner = useCallback(async () => {
    if (!walletClient) {
      setSigner(undefined);
      return;
    }

    try {
      const newSigner = await walletClientToSigner(walletClient);
      setSigner(newSigner);
    } catch (error) {
      console.error("Error getting signer:", error);
      setSigner(undefined);
    }
  }, [walletClient]);

  useEffect(() => {
    void getSigner();
  }, [getSigner]);

  return signer;
}

export function useProvider(): Provider | undefined {
  const publicClient = usePublicClient();
  const [provider, setProvider] = useState<Provider | undefined>(undefined);

  const getProvider = useCallback(() => {
    if (!publicClient) return;

    const tmpProvider = publicClientToProvider(publicClient);
    setProvider(tmpProvider);
  }, [publicClient]);

  useEffect(() => {
    getProvider();
  }, [getProvider]);

  return provider;
}
