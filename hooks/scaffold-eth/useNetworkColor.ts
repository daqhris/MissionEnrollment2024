import { useTargetNetwork } from "./useTargetNetwork";
import { useEffect, useState } from "react";
import type { ChainWithAttributes } from "~~/utils/scaffold-eth/networks";

export const DEFAULT_NETWORK_COLOR: [string, string] = ["#666666", "#bbbbbb"];

export function getNetworkColor(network: ChainWithAttributes, isDarkMode: boolean): string {
  const colorConfig = network.color ?? DEFAULT_NETWORK_COLOR;
  return Array.isArray(colorConfig) ? (isDarkMode ? colorConfig[1] : colorConfig[0]) : colorConfig;
}

export const useNetworkColor = (): ((network?: ChainWithAttributes) => string) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { targetNetwork } = useTargetNetwork();

  useEffect(() => {
    // Check if window is defined to avoid SSR issues
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const getColorForNetwork = (network: ChainWithAttributes = targetNetwork): string =>
    getNetworkColor(network, isDarkMode);

  // Ensure a default return value for SSR and client-side
  return (network?: ChainWithAttributes): string => {
    if (typeof window === "undefined") {
      return DEFAULT_NETWORK_COLOR[0];
    }
    return getColorForNetwork(network ?? targetNetwork);
  };
};
