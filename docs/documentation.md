# Mission Enrollment Documentation

## Overview
Mission Enrollment is a decentralized application (dApp) designed to verify and attest user participation in Ethereum events, specifically focusing on ETHGlobal Brussels 2024. The application integrates various Web3 technologies to provide a seamless user experience for identity verification, event attendance proof, and on-chain attestation.

## Key Features

### 1. Identity Verification
- Supports both Ethereum addresses and ENS names
- Real-time ENS resolution
- Robust error handling for invalid inputs

### 2. POAP Integration
- Fetches and verifies Proof of Attendance Protocol (POAP) tokens
- Filters POAPs specific to ETHGlobal Brussels 2024
- Displays POAP data including event name, date, and image

### 3. On-chain Attestation
- Utilizes Ethereum Attestation Service (EAS) for creating verifiable on-chain records
- Supports attestations on both Base and Optimism L2 rollups
- Includes ENS name (if available) in the attestation data

### 4. Smart Contract
- Implements role-based access control for attestation creation
- Provides functions for schema creation, attestation, and verification

### 5. UI/UX Improvements
- Responsive design with clear user feedback
- Loading indicators and error messages for better user experience
- Step-by-step guided process from identity verification to attestation

## Technical Stack
- Frontend: React with Next.js
- Blockchain Interaction: ethers.js, wagmi
- ENS Integration: ENS resolution via ethers.js
- POAP API: Custom API route with caching and rate limiting
- Smart Contracts: Solidity with OpenZeppelin libraries
- Attestation: Ethereum Attestation Service (EAS) SDK

## Usage Flow
1. User connects their Ethereum wallet
2. User verifies their identity using Ethereum address or ENS name
3. Application fetches and displays relevant POAPs
4. User selects desired L2 network for attestation (Base or Optimism)
5. On-chain attestation is created using EAS

## API Routes
- `/api/fetchPoaps`: Fetches POAPs for a given Ethereum address or ENS name

## Smart Contract Functions
- `createMissionEnrollmentSchema()`: Creates the schema for mission enrollment attestations
- `createMissionEnrollmentAttestation(address recipient, uint256 tokenId)`: Creates an attestation for a user
- `verifyAttestation(bytes32 attestationId)`: Verifies the validity of an attestation

## Future Improvements
- Support for additional Ethereum events and POAPs
- Integration with more L2 solutions
- Enhanced analytics and reporting features

## Security Considerations
- Rate limiting on API routes to prevent abuse
- Access control on smart contract functions
- Proper handling of user data and privacy

For more detailed information on each component, please refer to the respective source files in the project repository.
