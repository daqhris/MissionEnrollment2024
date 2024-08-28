# Mission Enrollment

**An enrollment tool for a collaborative mission on the Superchain.**

This app has 3 features that certify the enrollment of its user for an future mission.
Its use requires an onchain name, a non-fungible token from an in-person event, and the validation of an attestation signed by _daqhris.eth_ on either **Base** or **Optimism** blockchains.

This project provides a transparent process that requires 3 phases of control and validation: identity verification, event participation, and public attestation on the Superchain.  
It is built as a web application with **Next.js** and **React**, and runs on top of smart contracts integrating blockchain protocols: Ethereum Name Service (**ENS**), Ethereum Attestation Service (**EAS**) and Proof of Attendance Protocol (**POAP**).

## Key Features

### 1. Identity Check

- Supports both Ethereum addresses and ENS names
- Real-time ENS resolution
- Robust error handling for invalid inputs

### 2. POAP Ownership Verification

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

### Other Dev Tools

- **State Management**: React Query (with singleton QueryClient instance)
- **Wallet Login**: Wagmi
- **Styling**: Tailwind CSS
- **Type Checking**: TypeScript
- **Code Quality**: ESLint

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn
- An Ethereum wallet (Brave Wallet or any Web3-compatible wallet)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/MissionEnrollment.git
   cd MissionEnrollment
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary environment variables (refer to `.env.example` for required variables).

### Running the Application

1. Start the development server:

   ```
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

**Mission Enrollment** provides a streamlined, one-page application for people to enroll in advance of the _Zinneke Rescue Mission_.

1. User connects their Ethereum wallet
2. User verifies their identity using Ethereum address or ENS name
3. Application fetches and displays relevant POAPs
4. User selects desired L2 network for attestation (Base or Optimism)
5. On-chain attestation is created using EAS

## API Routes

- `/api/fetchPoaps`: Fetches POAPs for a given Ethereum address or ENS name

## Smart Contract Functions

The app utilizes the following smart contracts:

1. `POAPVerification.sol`: Integrates with the POAP protocol for verifying real-life event attendance.
2. `AttestationService.sol`: Handles the creation of attestation schemas and the issuance of attestations using the Ethereum Attestation Service.
3. `createMissionEnrollmentSchema()`: Creates the schema for mission enrollment attestations
4. `createMissionEnrollmentAttestation(address recipient, uint256 tokenId)`: Creates an attestation for a user
5. `verifyAttestation(bytes32 attestationId)`: Verifies the validity of an attestation

## ETHGlobal Brussels 2024

This onchain app includes a special feature that is dependent on ETHGlobal Brussels 2024.  
Users are invited to retrieve their ETHGlobal Brussels 2024 POAP, adding an extra layer of credibility to their enrollment attestations.  
The app builder participated in this global hackathon when it was held for the first time in Belgium.

## Disclaimer

If necessary, users should verify the authenticity of mission enrollments through additional public means.  
The source code was forked from the project [TruthBot by EAS](https://github.com/ethereum-attestation-service/eas-is-true) and parts of the codebase require components from [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2).

The app creation was initiated by _daqhris.eth_ at a virtual hackathon: [ETHGlobal Superhack 2024](https://ethglobal.com/events/superhack2024).  
Its build and deploy phases were made possible by the assistance of Devin, an AI software engineer.

[ethglobal.com/showcase/missionenrollment-i4fkr](https://ethglobal.com/showcase/missionenrollment-i4fkr)

## External Resources

- [Ethereum Attestation Service Documentation](https://docs.attest.sh/)
- [ENS Documentation](https://docs.ens.domains/)
- [POAP Documentation](https://documentation.poap.tech/)

## Deployment and Verification Status

### AttestationService Contract on Optimism Sepolia

- Contract Address: 0xa8f9605Bd27C779e445b584d3Ca489E1084efAFE
- Deployment Status: Successful
- Verification Status: Pending
- Current Issue: Invalid Etherscan API Key

#### Verification Plan:
1. Obtain a valid Etherscan API key for Optimism Sepolia
2. Update the `.env` file with the new API key
3. Run the verification command:
   ```
   npx hardhat --network optimism-sepolia verify --contract contracts/AttestationService.sol:AttestationService 0xa8f9605Bd27C779e445b584d3Ca489E1084efAFE 0xC2679fBD37d54388Ce493F1DB75320D236e1815e 0x54f0e66D5A04702F5Df9BAe330295a11bD862c81
   ```

### AttestationService Contract on Base Sepolia

- Deployment Status: Not deployed
- Reason: Missing SCHEMA_REGISTRY_ADDRESS for Base Sepolia

#### Next Steps:
1. Obtain the correct SCHEMA_REGISTRY_ADDRESS for Base Sepolia
2. Update the `.env` file with the correct address
3. Deploy the AttestationService contract
4. Verify the contract on Blockscout for Base Sepolia

Note: Ensure that the EAS_CONTRACT_ADDRESS (0xC2679fBD37d54388Ce493F1DB75320D236e1815e) is correct for both L2 networks before deployment.
