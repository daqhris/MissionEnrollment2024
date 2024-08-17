#!/bin/bash

# Load environment variables
source .env.local

# Check if BLOCKSCOUT_API_KEY is set
if [ -z "$BLOCKSCOUT_API_KEY" ]; then
    echo "Error: BLOCKSCOUT_API_KEY is not set in .env.local"
    exit 1
fi

# Contract details
CONTRACT_ADDRESS="0x54f0e66D5A04702F5Df9BAe330295a11bD862c81"
COMPILER_VERSION="v0.8.20+commit.a1b79de6"
LICENSE_TYPE="MIT"

# Read the source code from AttestationService.sol
SOURCE_CODE=$(cat ./contracts/AttestationService.sol)

# Encode the source code for JSON
ENCODED_SOURCE_CODE=$(echo "$SOURCE_CODE" | jq -sR)

# Prepare the JSON payload
JSON_PAYLOAD=$(cat <<EOF
{
  "address": "$CONTRACT_ADDRESS",
  "compiler_version": "$COMPILER_VERSION",
  "optimization": true,
  "optimization_runs": 200,
  "evm_version": "london",
  "source_code": $ENCODED_SOURCE_CODE,
  "contract_name": "AttestationService",
  "autodetect_constructor_args": true,
  "is_yul": false,
  "license_type": "$LICENSE_TYPE"
}
EOF
)

# Send the verification request
RESPONSE=$(curl -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $BLOCKSCOUT_API_KEY" \
    -d "$JSON_PAYLOAD" \
    "https://optimism-sepolia.blockscout.com/api/v2/smart-contracts/$CONTRACT_ADDRESS/verification/via/flattened-code")

# Check the response
if [[ $RESPONSE == *"status":"success"* ]]; then
    echo "Contract verification submitted successfully!"
else
    echo "Contract verification failed. Response:"
    echo "$RESPONSE"
fi
