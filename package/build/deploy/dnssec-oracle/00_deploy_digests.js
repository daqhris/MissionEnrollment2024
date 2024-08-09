const func = async function (hre) {
    const { network, viem } = hre;
    await viem.deploy('SHA1Digest', []);
    await viem.deploy('SHA256Digest', []);
    if (network.tags.test)
        await viem.deploy('DummyDigest', []);
};
func.tags = ['dnssec-digests'];
export default func;
