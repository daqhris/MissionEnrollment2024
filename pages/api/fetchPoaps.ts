import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const POAP_API_URL = "https://api.poap.tech/actions/scan";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Invalid address provided" });
  }

  if (!process.env.POAP_API_KEY) {
    console.error("POAP_API_KEY is not set in the environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const response = await axios.get(`${POAP_API_URL}/${address}`, {
      headers: {
        'X-API-Key': process.env.POAP_API_KEY
      }
    });
    const poaps = response.data;

    return res.status(200).json({ poaps });
  } catch (error) {
    console.error("Error fetching POAPs:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        if (axiosError.response.status === 404) {
          return res.status(404).json({ error: "No POAPs found for this address" });
        } else if (axiosError.response.status === 401) {
          return res.status(401).json({ error: "Unauthorized. Check POAP API key" });
        }
      } else if (axiosError.request) {
        return res.status(503).json({ error: "POAP API is unreachable" });
      }
    }

    return res.status(500).json({ error: "Error fetching POAPs" });
  }
}
