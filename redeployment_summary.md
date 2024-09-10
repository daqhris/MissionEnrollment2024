# Redeployment Summary

## Overview
This document summarizes the redeployment process of the AttestationService smart contract to the Base Sepolia and Optimism Sepolia networks. The deployment was successful on both networks, with upgradeable proxy contracts implemented.

## Key Steps
1. Updated the `deploy_upgradeable.js` script to support both networks
2. Modified the `.env` file to include necessary addresses for both networks
3. Updated `hardhat.config.js` to include the OpenZeppelin upgrades plugin
4. Executed the deployment script for both networks
5. Verified the deployed contracts on respective block explorers

## Challenges and Resolutions
1. **Challenge**: Ensuring correct EAS and SchemaRegistry addresses for each network
   **Resolution**: Updated `.env` file with network-specific addresses

2. **Challenge**: Adapting deployment script for multiple networks
   **Resolution**: Implemented a `deployContract` function with network-specific logic

3. **Challenge**: Upgrading to latest Hardhat and ethers.js versions
   **Resolution**: Updated deployment script to use `waitForDeployment()` and `getAddress()`

## Deployment Results

### Base Sepolia
- Proxy Address: 0x9f040BD10a6D6e70772ea3Ab055FFfc8E5Af6deF
- Implementation Address: 0x23E6C11A0cd7322498c0eC85cfCCaeeD3F3E7843

### Optimism Sepolia
- Proxy Address: 0x2909d5554944ba93d75F418429249C6105CbeBff
- Implementation Address: 0x23E6C11A0cd7322498c0eC85cfCCaeeD3F3E7843

## Key Changes
1. Updated `deploy_upgradeable.js`:
   - Added support for multiple networks
   - Implemented `waitForDeployment()` instead of `deployed()`
   - Used `getAddress()` for accessing contract addresses
2. Updated `.env` file with EAS and SchemaRegistry addresses for both networks
3. Added OpenZeppelin upgrades plugin to `hardhat.config.js`

## Next Steps
1. Monitor the deployed contracts for any issues
2. Prepare for future upgrades if necessary
3. Update frontend applications to interact with the new contract addresses

## Conclusion
The redeployment process was successful, with the AttestationService now operational on both Base Sepolia and Optimism Sepolia networks. The upgradeable architecture allows for future improvements and bug fixes without changing the contract addresses.
