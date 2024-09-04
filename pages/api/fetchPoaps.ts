import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { gnosisProvider, poapContract, safePoapContractCall } from "../../config";

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;
const requestCounts = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requestData = requestCounts.get(ip);

  if (!requestData || now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (requestData.count >= MAX_REQUESTS) {
    return true;
  }

  requestData.count++;
  return false;
}

interface PoapEvent {
  id: string;
  name: string;
  start_date: string;
  image_url: string;
}

interface Poap {
  event: PoapEvent;
  token_id: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ poaps: Poap[] } | ErrorResponse>): Promise<void> {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (typeof clientIp !== "string") {
    return res.status(400).json({ error: "Invalid client IP" });
  }

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: "Rate limit exceeded. Please try again later" });
  }

  const { address } = req.query;

  if (!address || typeof address !== "string") {
    console.error("Invalid or missing address:", address);
    return res.status(400).json({ error: "Invalid or missing address" });
  }

  let resolvedAddress: string;
  try {
    if (address.endsWith(".eth")) {
      console.log(`Attempting to resolve ENS name: ${address}`);
      const resolvedResult = await gnosisProvider.resolveName(address);
      console.log(`Provider resolution result: ${resolvedResult}`);

      if (resolvedResult) {
        resolvedAddress = resolvedResult;
        console.log(`Successfully resolved ENS name ${address} to: ${resolvedAddress}`);
      } else {
        console.log(`Failed to resolve ENS name ${address}`);
        throw new Error("ENS name could not be resolved");
      }
    } else {
      resolvedAddress = address;
      console.log(`Using provided address: ${resolvedAddress}`);
    }
  } catch (error) {
    console.error("Error in ENS resolution process:", error);
    return res
      .status(400)
      .json({ error: "Failed to resolve ENS name or invalid address", details: (error as Error).message });
  }

  const normalizedAddress = resolvedAddress.toLowerCase();
  if (!/^0x[a-f0-9]{40}$/.test(normalizedAddress)) {
    console.error("Invalid Ethereum address format:", normalizedAddress);
    return res.status(400).json({ error: "Invalid Ethereum address format" });
  }

  console.log(`Attempting to fetch POAPs for address: ${normalizedAddress}`);

  try {
    const balance = await safePoapContractCall<bigint>("balanceOf", normalizedAddress);
    if (!balance) {
      return res.status(404).json({ error: "No POAPs found for this address" });
    }

    const poaps: Poap[] = [];
    for (let i = 0; i < balance; i++) {
      const tokenId = await safePoapContractCall<bigint>("tokenOfOwnerByIndex", normalizedAddress, i);
      if (tokenId) {
        const tokenURI = await safePoapContractCall<string>("tokenURI", tokenId);
        if (tokenURI) {
          const response = await fetch(tokenURI);
          const metadata = await response.json();

          const eventStartDate = new Date(metadata.attributes.find((attr: any) => attr.trait_type === "start_date")?.value);
          const eventName = metadata.name;

          const isCorrectEvent = eventName.toLowerCase().includes("ethglobal brussels") && eventName.toLowerCase().includes("2024");
          const isWithinDateRange = eventStartDate >= new Date("2024-07-11T00:00:00Z") && eventStartDate <= new Date("2024-07-14T23:59:59Z");

          if (isCorrectEvent && isWithinDateRange) {
            poaps.push({
              event: {
                id: tokenId.toString(),
                name: eventName,
                start_date: eventStartDate.toISOString(),
                image_url: metadata.image_url
              },
              token_id: tokenId.toString()
            });
          }
        }
      }
    }

    console.log(`Filtered ${poaps.length} POAPs out of ${balance.toString()} total POAPs`);

    return res.status(200).json({ poaps });
  } catch (error) {
    console.error("Error fetching POAPs:", error);
    return res.status(500).json({ error: "Unexpected error fetching POAPs", details: (error as Error).message });
  }
}
