# Mission Enrollment

**An enrollment tool for a collaborative mission on the Superchain.**

This app has 3 features that certify the enrollment of its user for an future mission.
Its use requires an onchain name, a non-fungible token from an in-person event, and the validation of an attestation signed by _daqhris.eth_ on either **Base** or **Optimism** blockchains.

This project provides a transparent process that requires 3 phases of control and validation: identity verification, event participation, and public attestation on the Superchain.  
It is built as a web application with **Next.js** and **React**, and runs on top of smart contracts integrating blockchain protocols: Ethereum Name Service (**ENS**), Ethereum Attestation Service (**EAS**) and Proof of Attendance Protocol (**POAP**).

## Features

### UX

- **ENS Integration**: Supports Ethereum Name Service for user-friendly addressing and identity verification.
- **POAP Verification**: Integrates with POAP to verify attendance at an in-person event: ETHGlobal Brussels 2024.
- **Onchain Attestations**: Creates immutable records of mission enrollment using the Ethereum Attestation Service (EAS).

### UI

- **Interactive Single-Page Application**: Offers a streamlined user experience with stage-based components.
- **Recent Attestations**: Displays a list of recent attestations for public viewing.
- **Wallet Connection**: Seamless integration with Ethereum wallets.
- **Responsive Design**: Optimized for various screen sizes and devices.

## Other Dev Tools

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

1. Connect your Ethereum wallet to the application.

2. Navigate through the mission enrollment stages:
   a. Enter your ENS name or Ethereum address for identity verification.  
   b. The application will verify your onchain identity using ENS.  
   c. If applicable, the app will check for ETHGlobal Brussels 2024 POAP ownership.  
   d. Review the details of your mission participation.

3. Create an onchain attestation for your mission enrollment:  
   a. Click the "Create Attestation" button to initiate the process.  
   b. Sign the attestation transaction using your connected wallet.  
   c. Wait for the transaction to be confirmed on either Base or Optimism rollups.

4. Once confirmed, view your attestation details, which are now immutably recorded on the chosen public blockchain.

5. Explore the "Recent Attestations" section to see other verified mission enrollments.

## Smart Contracts

The app utilizes the following smart contracts:

1. `POAPVerification.sol`: Integrates with the POAP protocol for verifying real-life event attendance.
2. `AttestationService.sol`: Handles the creation of attestation schemas and the issuance of attestations using the Ethereum Attestation Service.

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
