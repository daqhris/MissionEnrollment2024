import React from "react";
import IdentityVerification from "./IdentityVerification";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import { useEnsAddress, useEnsName } from "wagmi";

// Mock the wagmi hooks
jest.mock("wagmi", () => ({
  useEnsAddress: jest.fn(() => ({ data: null, isLoading: false, error: null })),
  useEnsName: jest.fn(() => ({ data: null, isLoading: false, error: null })),
}));

describe("IdentityVerification", () => {
  const mockOnVerified = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: null });
    (useEnsName as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: null });
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
    jest.useFakeTimers();
    const mockAddress = "0x1234567890123456789012345678901234567890";
    const mockEnsName = "test.eth";

    // Start with loading state
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: true });

    const { rerender } = render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("vitalik.eth or 0x...");
    fireEvent.change(inputField, { target: { value: mockEnsName } });

    // Check for initial loading state
    expect(screen.getByText("Resolving ENS name...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /verify/i })).toBeDisabled();

    // Simulate ENS resolution completion
    act(() => {
      (useEnsAddress as jest.Mock).mockReturnValue({ data: mockAddress, isLoading: false });
      rerender(<IdentityVerification onVerified={mockOnVerified} />);
      jest.advanceTimersByTime(2000); // Advance timers by 2000ms (2 seconds)
    });

    // Wait for loading state to be removed and resolved address to be displayed
    await waitFor(() => {
      expect(screen.queryByText("Resolving ENS name...")).not.toBeInTheDocument();
      expect(screen.getByText(`Resolved Address: ${mockAddress}`)).toBeInTheDocument();
    });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    expect(verifyButton).toBeEnabled();

    // Click the verify button
    fireEvent.click(verifyButton);

    // Check if onVerified is called with the correct address
    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(mockAddress);
    });

    // Ensure no error message is displayed
    expect(screen.queryByText("Invalid ENS name or ENS resolution failed")).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it("calls onVerified with input address for valid Ethereum address", async () => {
    const mockAddress = "0x1234567890123456789012345678901234567890";

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("vitalik.eth or 0x...");
    fireEvent.change(inputField, { target: { value: mockAddress } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    expect(verifyButton).toBeEnabled();

    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(mockAddress);
    });

    expect(screen.queryByText("Invalid Ethereum address format")).not.toBeInTheDocument();
  });

  it("displays error for invalid Ethereum address", async () => {
    const invalidAddress = "0xinvalid";

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("vitalik.eth or 0x...");
    fireEvent.change(inputField, { target: { value: invalidAddress } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    expect(verifyButton).toBeEnabled();

    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid Ethereum address format")).toBeInTheDocument();
    });

    expect(mockOnVerified).not.toHaveBeenCalled();
  });

  it("displays error for invalid input", async () => {
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: null });
    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("vitalik.eth or 0x...");
    const verifyButton = screen.getByRole("button", { name: /verify/i });

    // Test invalid ENS name
    fireEvent.change(inputField, { target: { value: "invalid.eth" } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid ENS name or ENS resolution failed")).toBeInTheDocument();
    });

    expect(mockOnVerified).not.toHaveBeenCalled();

    // Clear the input field
    fireEvent.change(inputField, { target: { value: "" } });

    // Test invalid Ethereum address
    fireEvent.change(inputField, { target: { value: "0xinvalid" } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid Ethereum address format")).toBeInTheDocument();
    });

    expect(mockOnVerified).not.toHaveBeenCalled();
  });

  it("handles ENS resolution failure for valid Ethereum address", async () => {
    const validAddress = "0x1234567890123456789012345678901234567890";
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: new Error("ENS resolution failed") });
    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("vitalik.eth or 0x...");
    fireEvent.change(inputField, { target: { value: validAddress } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(validAddress);
    });

    expect(screen.queryByText("Invalid ENS name or ENS resolution failed")).not.toBeInTheDocument();
  });

  it("handles loading state correctly", async () => {
    jest.useFakeTimers();
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    (useEnsName as jest.Mock).mockReturnValue({ data: null, isLoading: true });

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("vitalik.eth or 0x...");
    fireEvent.change(inputField, { target: { value: "test.eth" } });

    expect(screen.getByRole("button", { name: /verify/i })).toBeDisabled();
    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(screen.getByText("Resolving ENS name...")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();

    jest.useRealTimers();
  });
});
