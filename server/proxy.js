const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fs = require("fs");
require("dotenv").config();

const app = express();

const POAP_API_URL = "https://api.poap.tech";
const PORT = process.env.PROXY_PORT || 3001;

// Function to log to file
const logToFile = message => {
  fs.appendFileSync("proxy-logs.txt", `${new Date().toISOString()}: ${message}\n`, { flag: "a" });
};

// Proxy middleware configuration
const poapProxy = createProxyMiddleware({
  target: POAP_API_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/poap-api": "", // Remove the '/poap-api' prefix when forwarding the request
  },
  onProxyReq: function (proxyReq, req, res) {
    logToFile(`Proxying request to: ${req.method} ${req.path}`);
    logToFile("Request headers: " + JSON.stringify(proxyReq.getHeaders()));
    // Add the POAP API key to the request headers
    const apiKey = process.env.NEXT_PUBLIC_POAP_API_KEY;
    if (apiKey) {
      proxyReq.setHeader("X-API-Key", apiKey);
      logToFile("POAP API Key set successfully");
    } else {
      logToFile("ERROR: NEXT_PUBLIC_POAP_API_KEY is not set");
      res.status(500).json({ error: "API Key is not configured" });
      return;
    }
    logToFile("Request headers after adding API key: " + JSON.stringify(proxyReq.getHeaders()));
  },
  onProxyRes: function (proxyRes, req, res) {
    logToFile(`Response received from POAP API. Status: ${proxyRes.statusCode}`);
    logToFile("Response headers: " + JSON.stringify(proxyRes.headers));
    proxyRes.headers["Access-Control-Allow-Origin"] = "*";
    logToFile("Headers after modification: " + JSON.stringify(proxyRes.headers));

    // Log response body for debugging
    let responseBody = "";
    proxyRes.on("data", function (chunk) {
      responseBody += chunk;
    });
    proxyRes.on("end", function () {
      logToFile("Response body: " + responseBody);
    });
  },
  onError: function (err, req, res) {
    logToFile(`Proxy error: ${err.message}`);
    res.status(500).json({ error: "Proxy error", message: err.message });
  },
});

// Error handling middleware
app.use((err, req, res, next) => {
  logToFile(`Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Use the proxy middleware
app.use("/poap-api", poapProxy);

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
  logToFile(`Proxy server is running on port ${PORT}`);
});
