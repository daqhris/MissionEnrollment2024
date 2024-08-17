import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const POAP_API_URL = "https://api.poap.tech/actions/scan";

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
    console.error("Invalid or missing Ethereum address:", address);
    return res.status(400).json({ error: "Invalid or missing Ethereum address" });
  }

  const normalizedAddress = address.toLowerCase();
  if (!/^0x[a-f0-9]{40}$/.test(normalizedAddress)) {
    console.error("Invalid Ethereum address format:", normalizedAddress);
    return res.status(400).json({ error: "Invalid Ethereum address format" });
  }

  const encodedAddress = encodeURIComponent(address.toLowerCase());

  if (!process.env.POAP_API_KEY) {
    console.error("POAP_API_KEY is not set in the environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  console.log(`Attempting to fetch POAPs for address: ${encodedAddress}`);

  try {
    console.log(`Fetching POAPs for address: ${encodedAddress}`);
    console.log(`POAP API URL: ${POAP_API_URL}/${encodedAddress}`);
    console.log(`POAP API Key (masked): ${process.env.POAP_API_KEY?.slice(0, 4)}...${process.env.POAP_API_KEY?.slice(-4)}`);

    console.log(`Making API request to: ${POAP_API_URL}/${encodedAddress}`);
    console.log(`Using API Key (masked): ${process.env.POAP_API_KEY?.slice(0, 4)}...${process.env.POAP_API_KEY?.slice(-4)}`);
    const response = await axios.get(`${POAP_API_URL}/${encodedAddress}`, {
      headers: {
        "X-API-Key": process.env.POAP_API_KEY,
      },
      timeout: 10000, // 10 seconds timeout
    });
    console.log(`API Response Status: ${response.status}`);
    console.log(`API Response Data Length: ${response.data.length}`);

    console.log(`POAP API Response Status: ${response.status}`);
    console.log(`Successfully fetched POAPs for address: ${encodedAddress}`);
    console.log(`Number of POAPs fetched: ${response.data.length}`);

    const allPoaps = response.data;

    // Filter POAPs for ETHGlobal Brussels 2024
    const filteredPoaps = allPoaps.filter((poap: any) => {
      const eventDate = new Date(poap.event.start_date);
      const eventStartDate = new Date("2024-07-11T00:00:00Z");
      const eventEndDate = new Date("2024-07-14T23:59:59Z");

      const isCorrectEvent = poap.event.name.toLowerCase().includes("ethglobal brussels") &&
                             poap.event.name.toLowerCase().includes("2024");
      const isWithinDateRange = eventDate >= eventStartDate && eventDate <= eventEndDate;

      console.log(`POAP event: ${poap.event.name}, Date: ${eventDate}, IsCorrectEvent: ${isCorrectEvent}, IsWithinDateRange: ${isWithinDateRange}`);

      return isCorrectEvent && isWithinDateRange;
    });

    console.log(`Filtered ${filteredPoaps.length} POAPs out of ${allPoaps.length} total POAPs`);

    return res.status(200).json({ poaps: filteredPoaps });
  } catch (error) {
    console.error("Error fetching POAPs:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return res.status(400).json({ error: "Bad request to POAP API" });
          case 401:
            return res.status(401).json({ error: "Unauthorized. Check POAP API key" });
          case 404:
            return res.status(404).json({ error: "No POAPs found for this address" });
          case 429:
            return res.status(429).json({ error: "Rate limit exceeded. Please try again later" });
          default:
            return res.status(500).json({ error: "Error from POAP API" });
        }
      } else if (error.request) {
        return res.status(503).json({ error: "POAP API is unreachable" });
      }
    }

    return res.status(500).json({ error: "Unexpected error fetching POAPs" });
  }
}
