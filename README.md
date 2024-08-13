# MissionEnrollment2024: Onchain Attestation and POAP Verification for Mission Enrollment

MissionEnrollment2024 is a decentralized application (dApp) that leverages blockchain technology to create immutable attestations for mission enrollment. Built with Next.js, React, and the Ethereum Attestation Service (EAS), this project provides a transparent and decentralized platform for verifying mission participation and achievements on the Ethereum network. It also integrates POAP (Proof of Attendance Protocol) functionality for event verification.

## Features

- **Onchain Attestations**: Creates immutable records of mission enrollment using the Ethereum Attestation Service (EAS).
- **ENS Integration**: Supports Ethereum Name Service for user-friendly addressing and identity verification.
- **POAP Verification**: Integrates with POAP to verify attendance at specific events, including ETHGlobal Brussels 2024.
- **Interactive Single-Page Application**: Offers a streamlined user experience with stage-based components.
- **Recent Attestations**: Displays a list of recent attestations for public viewing.
- **Wallet Connection**: Seamless integration with Ethereum wallets using Wagmi.
- **Responsive Design**: Optimized for various screen sizes and devices.

## Technology Stack

- **Frontend**: Next.js, React
- **State Management**: React Query with singleton QueryClient instance
- **Blockchain Integration**: Ethereum, EAS (Ethereum Attestation Service)
- **Wallet Connection**: Wagmi
- **Identity**: ENS (Ethereum Name Service)
- **Event Verification**: POAP (Proof of Attendance Protocol)
- **Styling**: Tailwind CSS
- **Type Checking**: TypeScript
- **Development Tools**: ESLint for code quality

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn or npm
- An Ethereum wallet (e.g., MetaMask, Brave Wallet, or any Web3-compatible wallet)

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
   or
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary environment variables (refer to `.env.example` for required variables).

### Running the Application

1. Start the development server:
   ```
   yarn dev
   ```
   or
   ```
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

MissionEnrollment2024 provides a streamlined single-page application flow for mission enrollment, verification, and POAP integration:

1. Connect your Ethereum wallet to the application.
2. Navigate through the mission enrollment stages:
   a. Enter your ENS name or Ethereum address for identity verification.
   b. The application will verify your onchain identity using ENS.
   c. If applicable, the app will check for ETHGlobal Brussels 2024 POAP ownership.
   d. Review the details of your mission participation.
3. Create an onchain attestation for your mission enrollment:
   a. Click the "Create Attestation" button to initiate the process.
   b. Sign the attestation transaction using your connected wallet.
   c. Wait for the transaction to be confirmed on the Ethereum network.
4. Once confirmed, view your attestation details, which are now immutably recorded on the blockchain.
5. Explore the "Recent Attestations" section to see other verified mission enrollments.

The application leverages Ethereum blockchain technology to ensure the integrity and immutability of mission enrollment records, while POAP integration provides an additional layer of event participation verification.

## Smart Contracts

The dApp utilizes the following smart contracts:

1. `AttestationService.sol`: Handles the creation of attestation schemas and attestations using the Ethereum Attestation Service.
2. `POAPVerification.sol`: Integrates with the POAP protocol for verifying event attendance.

These contracts provide a robust system for creating and verifying mission enrollment attestations and event participation on the Ethereum network.

## ETHGlobal Brussels 2024

This dApp includes special functionality for verifying attendance at ETHGlobal Brussels 2024. Participants can use their ETHGlobal Brussels 2024 POAP to validate their participation in the event, adding an extra layer of credibility to their mission enrollment attestations.

## Disclaimer

This project is for educational and demonstration purposes only. While the attestations are immutably recorded on the blockchain, users should verify the authenticity of mission enrollments through additional means when necessary.

## External Resources

- [Ethereum Attestation Service Documentation](https://docs.attest.sh/)
- [ENS Documentation](https://docs.ens.domains/)
- [POAP Documentation](https://documentation.poap.tech/)

For more detailed information on each component, please refer to the respective documentation.
