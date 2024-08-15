import { digests } from "./fixtures/digests.js";
import { expect } from "chai";
import hre from "hardhat";
import { stringToHex } from "viem";

digests.forEach(testcase => {
  async function fixture() {
    const digest = await hre.viem.deployContract(testcase.digest, []);
    return { digest };
  }
  describe(testcase.digest, () => {
    it("should return true for valid hashes", async () => {
      const { digest } = await fixture();
      await Promise.all(
        testcase.valids.map(async ([text, hash]) =>
          expect(digest.read.verify([stringToHex(text), hash])).resolves.toBe(true),
        ),
      );
    });
    it("should return false for invalid hashes", async () => {
      const { digest } = await fixture();
      await Promise.all(
        testcase.invalids.map(async ([text, hash]) =>
          expect(digest.read.verify([stringToHex(text), hash])).resolves.toBe(false),
        ),
      );
    });
    it("should throw an error for hashes of the wrong form", async () => {
      const { digest } = await fixture();
      const expectedError = `Invalid ${testcase.digest.split("Digest")[0].toLowerCase()} hash length`;
      await Promise.all(
        testcase.errors.map(async ([text, hash]) =>
          expect(digest)
            .read("verify", [stringToHex(text), hash])
            .toBeRevertedWithString(expectedError),
        ),
      );
    });
  });
});
