# MissionEnrolment2024: Onchain Attestation and Verification

MissionEnrolment2024 is a decentralized application (dApp) that leverages blockchain technology to create immutable attestations for mission enrolment. Built with Next.js, React, and the Ethereum Attestation Service (EAS), this project aims to provide a transparent and decentralized platform for verifying mission participation and achievements.

## SuperHack 2024 Context

This dApp was developed during SuperHack 2024, an online hackathon organized by ETHGlobal. The event took place from July 7th to July 28th, 2023, bringing together developers, designers, and blockchain enthusiasts to collaborate on innovative projects. MissionEnrolment2024 showcases the potential of blockchain technology in creating verifiable and transparent systems for mission-based activities.

## Features

- **Onchain Attestations**: Creates immutable records of mission enrolment using the Ethereum Attestation Service.
- **ENS Integration**: Supports Ethereum Name Service for user-friendly addressing.
- **ETHGlobal POAPs Retrieval**: Verifies attendance at ETHGlobal events through Proof of Attendance Protocol tokens.
- **Cross-Chain Transfers**: Utilizes Chainlink CCIP for seamless asset transfers across different blockchain networks.
- **Interactive UI**: Offers a user-friendly interface for submitting attestations and viewing results.
- **Recent Attestations**: Displays a list of recent attestations for public viewing.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Blockchain Integration**: Ethereum, EAS (Ethereum Attestation Service), Chainlink CCIP
- **Identity**: ENS (Ethereum Name Service)
- **Event Verification**: POAP (Proof of Attendance Protocol)
- **Styling**: Tailwind CSS with styled-components (twin.macro)
- **Animation**: Lottie for smooth, scalable animations

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn or npm
- Brave browser (preferred) or MetaMask

### Wallet Recommendations

We recommend using the following wallets for the best experience with MissionEnrolment2024:

1. **Brave Wallet (Preferred)**: The Brave browser comes with a built-in cryptocurrency wallet that offers enhanced privacy and security features. It's our recommended choice for interacting with this dApp.

2. **MetaMask (Secondary Option)**: If you're not using Brave, MetaMask is a solid alternative. It's a widely used Ethereum wallet that works as a browser extension.

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
   NEXT_PUBLIC_POAP_API_KEY=your_poap_api_key
   NEXT_PUBLIC_CHAINLINK_NODE_URL=your_chainlink_node_url
   ```

4. Run the development server:
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

MissionEnrolment2024 provides a streamlined user flow for mission enrolment and verification:

1. Connect your Ethereum wallet (preferably Brave Wallet or MetaMask) to the appropriate network.
2. Navigate to the main page and begin the mission enrolment process:
   a. Verify your identity using ENS (Ethereum Name Service).
   b. Retrieve and verify your ETHGlobal POAPs to confirm event attendance.
   c. Complete any required cross-chain asset transfers using Chainlink CCIP.
3. Create an onchain attestation for your mission enrolment:
   a. Review and confirm the details of your mission participation.
   b. Sign the attestation using your connected wallet.
4. Once created, view your attestation, which is now immutably recorded on the Ethereum network.
5. Explore the "Recent Attestations" page to see other verified mission enrolments and the growing community of participants.

This process ensures a transparent, verifiable record of your mission enrolment while leveraging the security and immutability of blockchain technology.

## Disclaimer

This project is for educational and demonstration purposes only. While the attestations are immutably recorded on the blockchain, users should verify the authenticity of mission enrolments through additional means when necessary. The cross-chain functionality provided by Chainlink CCIP is subject to the security and reliability of the underlying protocols.

## External Resources

- [Ethereum Attestation Service Documentation](https://docs.attest.sh/)
- [ENS Documentation](https://docs.ens.domains/)
- [POAP Documentation](https://documentation.poap.tech/)
- [Chainlink CCIP Documentation](https://docs.chain.link/ccip)

For more detailed information on each component, please refer to the respective documentation.
