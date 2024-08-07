// Import necessary libraries and contracts
const BurnAndMint = artifacts.require("BurnAndMint");
const truffleAssert = require('truffle-assertions');
const { mockChainlinkCCIP } = require('./mocks/ChainlinkCCIPMock');

// Test suite for the BurnAndMint contract
contract("BurnAndMint", accounts => {
  let burnAndMint;
  const owner = accounts[0];
  const receiver = accounts[1];
  const gnosisChainId = 100;
  const baseChainId = 8453;
  const optimismChainId = 10;

  // Deploy the BurnAndMint contract before running tests
  before(async () => {
    burnAndMint = await BurnAndMint.deployed();
    await mockChainlinkCCIP(burnAndMint);
  });

  // Test the burnAndMint function (Gnosis to Base)
  it("should perform a roundtrip transfer from Gnosis to Base and back", async () => {
    const tokenId = 1;

    // Mint an NFT on Gnosis chain
    await burnAndMint.mint(owner, tokenId);

    // Burn and mint from Gnosis to Base
    const txBurn = await burnAndMint.burnAndMint(tokenId, receiver, baseChainId);

    // Check that the NFT has been burned on Gnosis chain
    await truffleAssert.reverts(
      burnAndMint.ownerOf(tokenId),
      "ERC721: invalid token ID"
    );

    // Check that the BurnAndMintOperation event was emitted
    truffleAssert.eventEmitted(txBurn, 'BurnAndMintOperation', (ev) => {
      return ev.tokenId.toNumber() === tokenId &&
             ev.receiver === receiver &&
             ev.destinationChainSelector.toNumber() === baseChainId;
    });

    // Simulate CCIP message received on Base chain
    await burnAndMint.ccipReceive({
      sender: burnAndMint.address,
      data: web3.eth.abi.encodeParameters(['uint256'], [tokenId]),
      destChainSelector: baseChainId
    });

    // Check that the NFT is minted on Base chain
    assert.equal(await burnAndMint.ownerOf(tokenId), receiver, "NFT not minted on Base chain");

    // Burn and mint back from Base to Gnosis
    const txBurnBack = await burnAndMint.burnAndMint(tokenId, owner, gnosisChainId, { from: receiver });

    // Simulate CCIP message received on Gnosis chain
    await burnAndMint.ccipReceive({
      sender: burnAndMint.address,
      data: web3.eth.abi.encodeParameters(['uint256'], [tokenId]),
      destChainSelector: gnosisChainId
    });

    // Check that the NFT is back on Gnosis chain
    assert.equal(await burnAndMint.ownerOf(tokenId), owner, "NFT not returned to Gnosis chain");
  });

  // Test the burnAndMint function (Gnosis to Optimism)
  it("should perform a roundtrip transfer from Gnosis to Optimism and back", async () => {
    const tokenId = 2;

    // Mint an NFT on Gnosis chain
    await burnAndMint.mint(owner, tokenId);

    // Burn and mint from Gnosis to Optimism
    const txBurn = await burnAndMint.burnAndMint(tokenId, receiver, optimismChainId);

    // Check that the NFT has been burned on Gnosis chain
    await truffleAssert.reverts(
      burnAndMint.ownerOf(tokenId),
      "ERC721: invalid token ID"
    );

    // Simulate CCIP message received on Optimism chain
    await burnAndMint.ccipReceive({
      sender: burnAndMint.address,
      data: web3.eth.abi.encodeParameters(['uint256'], [tokenId]),
      destChainSelector: optimismChainId
    });

    // Check that the NFT is minted on Optimism chain
    assert.equal(await burnAndMint.ownerOf(tokenId), receiver, "NFT not minted on Optimism chain");

    // Burn and mint back from Optimism to Gnosis
    const txBurnBack = await burnAndMint.burnAndMint(tokenId, owner, gnosisChainId, { from: receiver });

    // Simulate CCIP message received on Gnosis chain
    await burnAndMint.ccipReceive({
      sender: burnAndMint.address,
      data: web3.eth.abi.encodeParameters(['uint256'], [tokenId]),
      destChainSelector: gnosisChainId
    });

    // Check that the NFT is back on Gnosis chain
    assert.equal(await burnAndMint.ownerOf(tokenId), owner, "NFT not returned to Gnosis chain");
  });

  // Test access control
  it("should only allow owner to set Chainlink details", async () => {
    const newOracleAddress = accounts[3];
    const newFee = web3.utils.toWei('0.2', 'ether');

    await truffleAssert.reverts(
      burnAndMint.setChainlinkDetails(newOracleAddress, newFee, { from: accounts[1] }),
      "Ownable: caller is not the owner"
    );

    // Set Chainlink details as owner
    await burnAndMint.setChainlinkDetails(newOracleAddress, newFee, { from: owner });

    // Verify the update (assuming getter functions have been added to the contract)
    const updatedOracleAddress = await burnAndMint.getChainlinkOracleAddress();
    const updatedFee = await burnAndMint.getChainlinkFee();
    assert.equal(updatedOracleAddress, newOracleAddress, "Oracle address not updated");
    assert.equal(updatedFee.toString(), newFee, "Fee not updated");
  });
});
