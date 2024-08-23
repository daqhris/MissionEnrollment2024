import { useTargetNetwork } from "./useTargetNetwork";
import { useEffect, useState } from "react";
import type { ChainWithAttributes } from "~~/utils/scaffold-eth/networks";

export const DEFAULT_NETWORK_COLOR: readonly [string, string] = ["#666666", "#bbbbbb"] as const;

export function getNetworkColor(network: ChainWithAttributes, isDarkMode: boolean): string {
  const colorConfig = network.color ?? DEFAULT_NETWORK_COLOR;
  return Array.isArray(colorConfig) ? (isDarkMode ? colorConfig[1] : colorConfig[0]) : colorConfig;
}

export const useNetworkColor = (): ((network?: ChainWithAttributes) => string) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { targetNetwork } = useTargetNetwork();

  useEffect((): (() => void) => {
    if (typeof window === "undefined") return (): void => {};

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent): void => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return (): void => mediaQuery.removeEventListener("change", handler);
  }, []);

  const getColorForNetwork = (network: ChainWithAttributes = targetNetwork): string =>
    getNetworkColor(network, isDarkMode);

  return (network?: ChainWithAttributes): string => {
    if (typeof window === "undefined") {
      return DEFAULT_NETWORK_COLOR[0];
    }
    return getColorForNetwork(network ?? targetNetwork);
  };
};
