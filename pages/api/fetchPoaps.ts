import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Redis from 'ioredis';

const POAP_API_URL = "https://api.poap.tech/actions/scan";

// Redis-based rate limiting

const RATE_LIMIT_WINDOW = 15 * 60; // 15 minutes in seconds
const MAX_REQUESTS = 100;

const redis = new Redis(process.env.REDIS_URL);

async function isRateLimited(ip: string): Promise<boolean> {
  const key = `ratelimit:${ip}`;
  const multi = redis.multi();

  multi.incr(key);
  multi.expire(key, RATE_LIMIT_WINDOW);

  const [count] = await multi.exec();

  if (!count || !Array.isArray(count)) {
    return false; // Assume not rate limited if Redis fails
  }

  return count[1] > MAX_REQUESTS;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (typeof clientIp !== 'string') {
    return res.status(400).json({ error: "Invalid client IP" });
  }

  if (await isRateLimited(clientIp)) {
    return res.status(429).json({ error: "Rate limit exceeded. Please try again later" });
  }

  const { address } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Invalid address provided" });
  }

  if (!process.env.POAP_API_KEY) {
    console.error("POAP_API_KEY is not set in the environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Log the POAP_API_KEY (partially masked for security)
  const maskedApiKey = process.env.POAP_API_KEY.slice(0, 4) + '*'.repeat(process.env.POAP_API_KEY.length - 8) + process.env.POAP_API_KEY.slice(-4);
  console.log(`Using POAP_API_KEY: ${maskedApiKey}`);

  try {
    const response = await axios.get(`${POAP_API_URL}/${address}`, {
      headers: {
        'X-API-Key': process.env.POAP_API_KEY
      },
      timeout: 10000 // 10 seconds timeout
    });
    const poaps = response.data;

    console.log("Fetched POAPs data:", JSON.stringify(poaps, null, 2));

    return res.status(200).json({ poaps });
  } catch (error) {
    console.error("Error fetching POAPs:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        switch (axiosError.response.status) {
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
      } else if (axiosError.request) {
        return res.status(503).json({ error: "POAP API is unreachable" });
      }
    }

    return res.status(500).json({ error: "Unexpected error fetching POAPs" });
  }
}
