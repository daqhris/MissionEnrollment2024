import axios from "axios";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

const POAP_API_URL = "https://api.poap.tech/actions/scan";
console.log(`ETHEREUM_RPC_URL: ${process.env.ETHEREUM_RPC_URL}`);

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    console.log(`ETHEREUM_RPC_URL: ${process.env.ETHEREUM_RPC_URL}`);
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);

    if (address.endsWith(".eth")) {
      console.log(`Attempting to resolve ENS name: ${address}`);
      const resolvedResult = await provider.resolveName(address);
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

  const encodedAddress = encodeURIComponent(address.toLowerCase());

  if (!process.env.POAP_API_KEY) {
    console.error("POAP_API_KEY is not set in the environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Removed check for INFURA_PROJECT_ID as we're now using Alchemy

  console.log(`Attempting to fetch POAPs for address: ${encodedAddress}`);

  try {
    console.log(`Fetching POAPs for address: ${encodedAddress}`);
    console.log(`POAP API URL: ${POAP_API_URL}/${encodedAddress}`);
    console.log(
      `POAP API Key (masked): ${process.env.POAP_API_KEY?.slice(0, 4)}...${process.env.POAP_API_KEY?.slice(-4)}`,
    );

    const response = await axios.get(`${POAP_API_URL}/${encodedAddress}`, {
      headers: {
        "X-API-Key": process.env.POAP_API_KEY,
      },
      timeout: 10000, // 10 seconds timeout
    });

    console.log(`POAP API Response Status: ${response.status}`);
    console.log(`Response headers:`, response.headers);
    console.log(`Successfully fetched POAPs for address: ${encodedAddress}`);

    if (!response.data) {
      throw new Error("Empty response data from POAP API");
    }

    if (!Array.isArray(response.data)) {
      console.error(`Unexpected response format:`, response.data);
      throw new Error(`Unexpected response format from POAP API`);
    }

    console.log(`Number of POAPs fetched: ${response.data.length}`);
    console.log(`First POAP in response:`, JSON.stringify(response.data[0], null, 2));

    const allPoaps = response.data;

    // Filter POAPs for ETHGlobal Brussels 2024
    const filteredPoaps = allPoaps.filter((poap: any) => {
      const eventDate = new Date(poap.event.start_date);
      const eventStartDate = new Date("2024-07-11T00:00:00Z");
      const eventEndDate = new Date("2024-07-14T23:59:59Z");

      const isCorrectEvent =
        poap.event.name.toLowerCase().includes("ethglobal brussels") && poap.event.name.toLowerCase().includes("2024");
      const isWithinDateRange = eventDate >= eventStartDate && eventDate <= eventEndDate;

      console.log(
        `POAP event: ${poap.event.name}, Date: ${eventDate}, IsCorrectEvent: ${isCorrectEvent}, IsWithinDateRange: ${isWithinDateRange}`,
      );

      return isCorrectEvent && isWithinDateRange;
    });

    console.log(`Filtered ${filteredPoaps.length} POAPs out of ${allPoaps.length} total POAPs`);

    return res.status(200).json({ poaps: filteredPoaps });
  } catch (error) {
    console.error("Error fetching POAPs:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.error || "Unknown error";
        console.error(`POAP API Error: Status ${statusCode}, Message: ${errorMessage}`);

        switch (statusCode) {
          case 400:
            return res.status(400).json({ error: `Bad request to POAP API: ${errorMessage}` });
          case 401:
            return res.status(401).json({ error: "Unauthorized. Check POAP API key" });
          case 404:
            return res.status(404).json({ error: "No POAPs found for this address" });
          case 429:
            return res.status(429).json({ error: "Rate limit exceeded. Please try again later" });
          default:
            return res.status(500).json({ error: `Error from POAP API: ${errorMessage}` });
        }
      } else if (error.request) {
        console.error("POAP API request failed:", error.request);
        return res.status(503).json({ error: "POAP API is unreachable" });
      }
    }

    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Unexpected error fetching POAPs" });
  }
}
