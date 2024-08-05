# Onchain Mission Enrolment

Onchain Mission Enrolment is an example web app that leverages blockchain technology to create immutable attestations for statements. Built with Next.js, React, and the Ethereum Attestation Service (EAS), this project aims to combat misinformation by providing a transparent and decentralized platform for mission enrolment.

## Features

- **Blockchain Attestations**: Creates immutable records of statements using the Ethereum Attestation Service.
- **Interactive UI**: Offers a user-friendly interface for submitting statements and viewing results.
- **Recent Attestations**: Displays a list of recent attestations for public viewing.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Blockchain Integration**: Ethereum, EAS (Ethereum Attestation Service)
- **Styling**: Tailwind CSS with styled-components (twin.macro)
- **Animation**: Lottie for smooth, scalable animations

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn or npm
- MetaMask or another Ethereum wallet

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/mission-enrolment.git
   cd mission-enrolment
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
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Connect your Ethereum wallet (e.g., MetaMask) to the Sepolia testnet.
2. Navigate to the main page and enter a statement you want to attest.
3. Click "Create Attestation" to submit the statement to the blockchain.
4. View the created attestation, which is now immutably recorded on the Ethereum network.
5. Explore recent attestations on the "Recent Attestations" page to see other blockchain-verified statements.

## Disclaimer

This project is for educational and demonstration purposes only. While the attestations are immutably recorded on the blockchain, the content of the statements should not be considered as absolute truth. Users are encouraged to cross-reference information from multiple reliable sources and use critical thinking when evaluating the attested statements.
