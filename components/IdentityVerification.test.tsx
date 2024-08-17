import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import IdentityVerification from "./IdentityVerification";
import { useEnsAddress, useEnsName } from "wagmi";

// Mock the wagmi hooks
jest.mock("wagmi", () => ({
  useEnsAddress: jest.fn(),
  useEnsName: jest.fn(),
}));

describe("IdentityVerification", () => {
  const mockOnVerified = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (useEnsName as jest.Mock).mockReturnValue({ data: null, isLoading: false });
  });

  it("renders input field and verify button", () => {
    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("vitalik.eth or 0x...");
    expect(inputField).toBeInTheDocument();

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    expect(verifyButton).toBeInTheDocument();
  });

  it("disables verify button when input is empty", () => {
    render(<IdentityVerification onVerified={mockOnVerified} />);

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    expect(verifyButton).toBeDisabled();
  });

  it("enables verify button when input is not empty", () => {
    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("vitalik.eth or 0x...");
    fireEvent.change(inputField, { target: { value: "test.eth" } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    expect(verifyButton).toBeEnabled();
  });

  it("calls onVerified with resolved address for valid ENS name", async () => {
    const mockAddress = "0x1234567890123456789012345678901234567890";
    (useEnsAddress as jest.Mock).mockReturnValue({ data: mockAddress, isLoading: false });

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("vitalik.eth or 0x...");
    fireEvent.change(inputField, { target: { value: "test.eth" } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(mockAddress);
    });
  });

  it("calls onVerified with input address for valid Ethereum address", async () => {
    const mockAddress = "0x1234567890123456789012345678901234567890";

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("vitalik.eth or 0x...");
    fireEvent.change(inputField, { target: { value: mockAddress } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(mockAddress);
    });
  });

  it("displays error for invalid input", async () => {
    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("vitalik.eth or 0x...");
    fireEvent.change(inputField, { target: { value: "invalid-input" } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid Ethereum address format")).toBeInTheDocument();
    });
  });
});
