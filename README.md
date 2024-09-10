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

### 3. Onchain Attestation

- Utilizes Ethereum Attestation Service (EAS) for creating verifiable onchain records
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

1. User connects their Ethereum wallet and verifies their identity (ENS).
2. The application fetches and displays relevant POAPs.
3. User selects the desired L2 network (Base or Optimism) for attestation creation using EAS.

## API Routes

- `/api/fetchPoaps`: Fetches POAPs for a given Ethereum address or ENS name

## Smart Contracts

`POAPVerification.sol`: Integrates with the POAP protocol for verifying real-life event attendance.

`AttestationService.sol`: This contract implements on-chain attestation using the Ethereum Attestation Service (EAS). It features role-based access control, with specific roles for attestation creators and administrators. The contract uses a custom schema for mission enrollment attestations, which includes the user's address, token ID, timestamp, and attester's address.

## Smart Contract Functions

1. `createMissionEnrollmentSchema()`: Creates the schema for mission enrollment attestations
2. `createMissionEnrollmentAttestation(address recipient, uint256 tokenId)`: Creates an attestation for a user
3. `verifyAttestation(bytes32 attestationId)`: Verifies the validity of an attestation

## Frontend Components

- `IdentityVerification.tsx`: This component handles user identity verification by validating Ethereum addresses. It ensures that users are properly authenticated before proceeding with attestations.
- `OnchainAttestation.tsx`: This component manages the creation of on-chain attestations, supporting both Base and Optimism L2 rollups. It integrates with the user's wallet using wagmi hooks and encodes POAP data for attestation.

## ETHGlobal Brussels 2024

This onchain app includes a special feature that is dependent on ETHGlobal Brussels 2024.  
Users are invited to retrieve their ETHGlobal Brussels 2024 POAP, adding an extra layer of credibility to their enrollment attestations.  
The app builder participated in this global hackathon when it was held for the first time in Belgium.

## Deployed Contracts

The AttestationService contract has been deployed on the following networks:

### Base Sepolia
- Proxy Address: 0x9f040BD10a6D6e70772ea3Ab055FFfc8E5Af6deF
- Implementation Address: 0x23E6C11A0cd7322498c0eC85cfCCaeeD3F3E7843

### Optimism Sepolia
- Proxy Address: 0x2909d5554944ba93d75F418429249C6105CbeBff
- Implementation Address: 0x23E6C11A0cd7322498c0eC85cfCCaeeD3F3E7843

Both deployments use the following addresses:
- EAS Contract Address: 0xC2679fBD37d54388Ce493F1DB75320D236e1815e
- Schema Registry Address: 0x54f0e66D5A04702F5Df9BAe330295a11bD862c81

## External Resources

- [Ethereum Attestation Service Documentation](https://docs.attest.sh/)
- [ENS Documentation](https://docs.ens.domains/)
- [POAP Documentation](https://documentation.poap.tech/)


## Disclaimer

If necessary, users should verify the authenticity of mission enrollments through additional public means.  
The source code was forked from the project [TruthBot by EAS](https://github.com/ethereum-attestation-service/eas-is-true) and parts of the codebase require components from [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2).

The creation of the dApp was initiated by _daqhris.eth_ at a virtual hackathon: [ETHGlobal Superhack 2024](https://ethglobal.com/events/superhack2024).  
This became possible thanks to the help and collaboration of Devin, the world's first AI software engineer, created by [Cognition.AI](https://www.cognition.ai/).

[ethglobal.com/showcase/missionenrollment-i4fkr](https://ethglobal.com/showcase/missionenrollment-i4fkr)
