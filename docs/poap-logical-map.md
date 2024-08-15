# POAP API Information Flow: Logical Map

## Overview
The `MissionEnrollment` application integrates with the POAP API to retrieve information related to users' participation in specific events, such as "ETHGlobal Brussels 2024". This information serves as a prerequisite before issuing onchain attestations.

## Flow

### 1. User Connects Wallet
- Users are required to connect their Ethereum wallet to the application, enabling the app to fetch their associated addresses.

### 2. POAP Data Retrieval
- The connected user's Ethereum address triggers an API request to the `/pages/api/fetchPoaps.ts` endpoint.
- This endpoint then fetches the user's POAPs from the POAP API, filtering for events like "ETHGlobal Brussels 2024".
- Error handling includes checking for errors like unauthorized requests or rate limits.

### 3. Data Processing
- Retrieved POAP data is filtered for the specific event within the handler function.
- Validated POAPs are sent back to the client.

### 4. Presentation to the User
- The frontend component, specifically the `EventAttendanceProof` component, displays POAP data.
- It shows users whether they have the required event POAPs to progress further in the enrollment.

### 5. Onchain Attestation Stage
- Once the event attendance is confirmed, users are eligible to create an onchain attestation.
- The application transitions to the `OnchainAttestation` component where the attestation process begins.

### Conclusion
This map details how critical information flows from the POAP API to user presentation, ensuring eligibility before users proceed with creating onchain attestations.
