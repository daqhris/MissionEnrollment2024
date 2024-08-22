import { useEffect, useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import type { Address, Log } from "viem";
import { usePublicClient } from "wagmi";

export const useContractLogs = (address: Address): Log[] => {
  const [logs, setLogs] = useState<Log[]>([]);
  const { targetNetwork } = useTargetNetwork();
  const client = usePublicClient({ chainId: targetNetwork.id });

  useEffect(() => {
    const fetchLogs = async (): Promise<void> => {
      if (!client) {
        console.error("Client not found");
        return;
      }
      try {
        const existingLogs = await client.getLogs({
          address,
          fromBlock: 0n,
          toBlock: "latest",
        });
        setLogs(existingLogs);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };
    void fetchLogs();

    const unwatch = client?.watchBlockNumber({
      onBlockNumber: async (_blockNumber, prevBlockNumber) => {
        if (!client) return;
        const newLogs = await client.getLogs({
          address,
          fromBlock: prevBlockNumber,
          toBlock: "latest",
        });
        setLogs(prevLogs => [...prevLogs, ...newLogs]);
      },
    });

    return () => {
      if (unwatch) unwatch();
    };
  }, [address, client]);

  return logs;
};
