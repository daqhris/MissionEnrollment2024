const func = async function (hre) {
  const { viem } = hre;
  await viem.deploy("ExtendedDNSResolver", []);
};
func.tags = ["resolvers", "ExtendedDNSResolver"];
export default func;
