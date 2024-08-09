# MissionEnrolment2024: Onchain Attestation and Verification

MissionEnrolment2024 is a decentralized application (dApp) that leverages blockchain technology to create immutable attestations for mission enrolment. Built with Next.js, React, and the Ethereum Attestation Service (EAS), this project aims to provide a transparent and decentralized platform for verifying mission participation and achievements.

## SuperHack 2024 Context

This dApp was developed during SuperHack 2024, an online hackathon organized by ETHGlobal. The event took place from July 7th to July 28th, 2023, bringing together developers, designers, and blockchain enthusiasts to collaborate on innovative projects. MissionEnrolment2024 showcases the potential of blockchain technology in creating verifiable and transparent systems for mission-based activities.

## Features

- **Onchain Attestations**: Creates immutable records of mission enrolment using the Ethereum Attestation Service.
- **ENS Integration**: Supports Ethereum Name Service for user-friendly addressing.
- **ETHGlobal POAPs Retrieval**: Verifies attendance at ETHGlobal events through Proof of Attendance Protocol tokens.
- **Cross-Chain Transfers**: Utilizes Chainlink CCIP for seamless asset transfers across different blockchain networks.
- **Interactive Single-Page Application**: Offers a streamlined user experience with stage-based components.
- **Recent Attestations**: Displays a list of recent attestations for public viewing.
- **POAP Integration**: Prepared integration points for future POAP-related features.

## Technology Stack

- **Frontend**: Next.js, React
- **State Management**: React Query with singleton QueryClient instance
- **Blockchain Integration**: Ethereum, EAS (Ethereum Attestation Service), Chainlink CCIP
- **Identity**: ENS (Ethereum Name Service)
- **Event Verification**: POAP (Proof of Attendance Protocol)
- **Styling**: Tailwind CSS
- **Type Checking**: TypeScript
- **Development Tools**: ESLint for code quality

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn or npm
- Brave browser (preferred) or MetaMask



### Installation

1. Clone the repository:
   ```
   git clone https://github.com/daqhris/MissionEnrolment2024.git
   cd MissionEnrolment2024
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   ETH_KEY=attester_key
   ```

4. Run the development server:
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

MissionEnrolment2024 provides a streamlined single-page application flow for mission enrolment and verification:

1. Connect your Ethereum wallet (preferably Brave Wallet or MetaMask) to the appropriate network.
2. Navigate through the mission enrolment stages:
   a. Verify your identity using ENS (Ethereum Name Service).
   b. Retrieve and verify your ETHGlobal POAPs to confirm event attendance.
   c. Review and confirm the details of your mission participation.
3. Create an onchain attestation for your mission enrolment:
   a. Sign the attestation using your connected wallet.
   b. Wait for the transaction to be confirmed on the Ethereum network.
4. Once created, view your attestation, which is now immutably recorded on the blockchain.
5. Explore the list of recent attestations to see other verified mission enrolments and the growing community of participants.

This process ensures a transparent, verifiable record of your mission enrolment while leveraging the security and immutability of blockchain technology.

## Disclaimer

This project is for educational and demonstration purposes only. While the attestations are immutably recorded on the blockchain, users should verify the authenticity of mission enrolments through additional means when necessary.

## Recent Updates

- Implemented a single-page application flow with stage components for a more interactive user experience.
- Integrated a singleton QueryClient instance for improved state management across the application.
- Enhanced error handling in the QueryClientProvider setup.
- Optimized server-side rendering (SSR) for better performance.
- Added a custom 404 page for improved user navigation.
- Resolved ESLint issues in _app.tsx for better code quality.
- Prepared integration points for future POAP functionality.
- Removed outdated features such as voting and AI functionality to focus on core mission enrolment processes.
- Renamed the dApp and removed unused endpoints for clarity and accuracy.

## External Resources

- [Ethereum Attestation Service Documentation](https://docs.attest.sh/)
- [ENS Documentation](https://docs.ens.domains/)
- [POAP Documentation](https://documentation.poap.tech/)

For more detailed information on each component, please refer to the respective documentation.
