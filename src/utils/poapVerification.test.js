import axios from "axios";
import { verifyPOAPOwnership, verifyETHGlobalBrusselsPOAPOwnership } from "./poapVerification";

jest.mock("axios");

describe("POAP Verification", () => {
  const mockAddress = "0x1234567890123456789012345678901234567890";
  const mockEventId = "176334";

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.POAP = "mock-api-key";
  });

  describe("verifyPOAPOwnership", () => {
    it("should return true when user owns POAP", async () => {
      axios.get.mockResolvedValue({ data: [{ some: "data" }] });
      const result = await verifyPOAPOwnership(mockAddress, mockEventId);
      expect(result).toBe(true);
    });

    it("should return false when user does not own POAP", async () => {
      axios.get.mockResolvedValue({ data: [] });
      const result = await verifyPOAPOwnership(mockAddress, mockEventId);
      expect(result).toBe(false);
    });

    it("should return false when API call fails", async () => {
      axios.get.mockRejectedValue(new Error("API Error"));
      const result = await verifyPOAPOwnership(mockAddress, mockEventId);
      expect(result).toBe(false);
    });
  });

  describe("verifyETHGlobalBrusselsPOAPOwnership", () => {
    it("should return true if user owns any ETHGlobal Brussels 2024 POAP", async () => {
      axios.get.mockResolvedValueOnce({ data: [] }).mockResolvedValueOnce({ data: [{ some: "data" }] });
      const result = await verifyETHGlobalBrusselsPOAPOwnership(mockAddress);
      expect(result).toBe(true);
    });

    it("should return false if user does not own any ETHGlobal Brussels 2024 POAP", async () => {
      axios.get.mockResolvedValue({ data: [] });
      const result = await verifyETHGlobalBrusselsPOAPOwnership(mockAddress);
      expect(result).toBe(false);
    });
  });
});
