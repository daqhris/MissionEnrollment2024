import React from "react";
import IdentityVerification from "./IdentityVerification";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import { useEnsAddress, useEnsName } from "wagmi";
import { isAddress, getAddress } from "viem";

// Mock viem functions
jest.mock("viem", () => ({
  isAddress: jest.fn().mockImplementation((address: string) => /^0x[a-fA-F0-9]{40}$/.test(address)),
  getAddress: jest.fn((address: string) => address.toLowerCase()),
}));

// Polyfill for BigInt
if (typeof BigInt === 'undefined') global.BigInt = require('big-integer');

// Mock the wagmi hooks
jest.mock("wagmi", () => ({
  useEnsAddress: jest.fn((name: string) => {
    if (name === "test.eth") {
      return { data: "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82", isLoading: false, error: null };
    }
    return { data: null, isLoading: false, error: new Error("ENS resolution failed") };
  }),
  useEnsName: jest.fn((address: string) => {
    if (address === "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82") {
      return { data: "test.eth", isLoading: false, error: null };
    }
    return { data: null, isLoading: false, error: null };
  }),
}));

describe("IdentityVerification", () => {
  const mockOnVerified = jest.fn();
  const mockFetchPoaps = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: null });
    (useEnsName as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: null });
    mockFetchPoaps.mockResolvedValue([]);
    jest.mock('../utils/fetchPoapsUtil', () => ({
      fetchPoaps: mockFetchPoaps,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Add a new beforeAll to ensure proper test execution context
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders input field and verify button", () => {
    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("0x...");
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

    const inputField = screen.getByPlaceholderText("0x...");
    fireEvent.change(inputField, { target: { value: "test.eth" } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    expect(verifyButton).toBeEnabled();
  });

  it("calls onVerified with resolved address for valid ENS name", async () => {
    jest.useFakeTimers();
    const mockAddress = "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82";
    const mockEnsName = "test.eth";

    // Start with loading state
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    (useEnsName as jest.Mock).mockReturnValue({ data: null, isLoading: true });

    const { rerender } = render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("0x...");
    fireEvent.change(inputField, { target: { value: mockEnsName } });

    // Check for initial loading state
    expect(screen.getByText("Resolving address...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /verify/i })).toBeDisabled();

    // Simulate ENS resolution completion
    act(() => {
      (useEnsAddress as jest.Mock).mockReturnValue({ data: mockAddress, isLoading: false });
      (useEnsName as jest.Mock).mockReturnValue({ data: mockEnsName, isLoading: false });
      rerender(<IdentityVerification onVerified={mockOnVerified} />);
      jest.runAllTimers(); // Run all timers instead of advancing by a fixed amount
    });

    // Wait for loading state to be removed and resolved address to be displayed
    await waitFor(() => {
      expect(screen.queryByText("Resolving address...")).not.toBeInTheDocument();
      expect(screen.getByText(`Resolved Address: ${mockAddress}`)).toBeInTheDocument();
    });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    expect(verifyButton).toBeEnabled();

    // Click the verify button
    await act(async () => {
      fireEvent.click(verifyButton);
    });

    // Check if onVerified is called with the correct address
    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(mockAddress.toLowerCase());
    });

    // Ensure no error message is displayed
    expect(screen.queryByText("Invalid Ethereum address format")).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it("calls onVerified with input address for valid Ethereum address", async () => {
    const mockAddress = "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82";
    const mockFetchPoaps = jest.fn().mockResolvedValue([]);
    jest.mock('../utils/fetchPoapsUtil', () => ({
      fetchPoaps: mockFetchPoaps,
    }));

    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (useEnsName as jest.Mock).mockReturnValue({ data: null, isLoading: false });

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("0x...");
    fireEvent.change(inputField, { target: { value: mockAddress } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    expect(verifyButton).toBeEnabled();

    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(mockAddress.toLowerCase());
      expect(mockFetchPoaps).toHaveBeenCalledWith(mockAddress.toLowerCase());
    }, { timeout: 5000 });

    expect(screen.queryByText("Invalid Ethereum address format")).not.toBeInTheDocument();
    expect(verifyButton).toBeEnabled();

    // Ensure the component has finished updating
    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledTimes(1);
    });
  });

  it("handles network errors when verifying address", async () => {
    const mockAddress = "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82";
    (useEnsName as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: new Error("Network Error") });
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: new Error("Network Error") });

    const mockFetchPoaps = jest.fn().mockRejectedValue(new Error("Network Error"));
    jest.mock('../utils/fetchPoapsUtil', () => ({
      fetchPoaps: mockFetchPoaps,
    }));

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("0x...");
    fireEvent.change(inputField, { target: { value: mockAddress } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/An error occurred while fetching ENS data/)).toBeInTheDocument();
      expect(screen.getByText(/An error occurred while fetching POAP data/)).toBeInTheDocument();
    });

    expect(mockOnVerified).not.toHaveBeenCalled();
    expect(mockFetchPoaps).toHaveBeenCalledWith(mockAddress.toLowerCase());
  });

  it("displays error for invalid Ethereum address", async () => {
    const invalidAddress = "0xinvalid";
    const validAddress = "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82";
    (useEnsName as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: null });
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: null });
    jest.mocked(isAddress).mockImplementation((address: string) => address === validAddress);

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("0x...");

    // Test with invalid address
    fireEvent.change(inputField, { target: { value: invalidAddress } });
    const verifyButton = screen.getByRole("button", { name: /verify/i });
    expect(verifyButton).toBeEnabled();

    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Invalid Ethereum address format")).toBeInTheDocument();
    });

    expect(mockOnVerified).not.toHaveBeenCalled();
    expect(isAddress).toHaveBeenCalledWith(invalidAddress);

    // Test with valid address
    fireEvent.change(inputField, { target: { value: validAddress } });
    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(screen.queryByText("Invalid Ethereum address format")).not.toBeInTheDocument();
    });

    expect(isAddress).toHaveBeenCalledWith(validAddress);
    expect(mockOnVerified).toHaveBeenCalledWith(validAddress.toLowerCase());
  });

  it("handles valid Ethereum address without ENS name", async () => {
    const validAddress = "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82";
    (useEnsName as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: null });
    (useEnsAddress as jest.Mock).mockReturnValue({ data: validAddress, isLoading: false, error: null });
    const mockFetchPoaps = jest.fn().mockResolvedValue([]);
    jest.mock('../utils/fetchPoapsUtil', () => ({
      fetchPoaps: mockFetchPoaps,
    }));

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("0x...");
    fireEvent.change(inputField, { target: { value: validAddress } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(validAddress.toLowerCase());
      expect(mockFetchPoaps).toHaveBeenCalledWith(validAddress.toLowerCase());
      expect(screen.queryByText("Invalid Ethereum address format")).not.toBeInTheDocument();
      expect(verifyButton).toBeEnabled();
    });
  });

  it("handles ENS resolution failure for valid Ethereum address", async () => {
    const validAddress = "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82";
    (useEnsName as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: new Error("ENS resolution failed") });
    (useEnsAddress as jest.Mock).mockReturnValue({ data: validAddress, isLoading: false, error: null });
    const mockFetchPoaps = jest.fn().mockResolvedValue([]);
    jest.mock('../utils/fetchPoapsUtil', () => ({
      fetchPoaps: mockFetchPoaps,
    }));

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("0x...");
    fireEvent.change(inputField, { target: { value: validAddress } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });

    await act(async () => {
      fireEvent.click(verifyButton);
    });

    // Wait for the component to finish updating
    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(validAddress.toLowerCase());
      expect(mockFetchPoaps).toHaveBeenCalledWith(validAddress.toLowerCase());
      expect(screen.queryByText("Invalid Ethereum address format")).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Ensure all state updates and asynchronous operations have completed
    await act(async () => {
      jest.runAllTimers();
    });

    // Additional assertions to verify component state after all updates
    expect(inputField).toHaveValue(validAddress);
    expect(verifyButton).toBeEnabled();
    expect(screen.queryByText("Verifying...")).not.toBeInTheDocument();
  });

  it("displays error for invalid input", async () => {
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: new Error("ENS resolution failed") });
    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("0x...");
    const verifyButton = screen.getByRole("button", { name: /verify/i });

    // Test invalid ENS name
    fireEvent.change(inputField, { target: { value: "invalid.eth" } });
    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(screen.getByText("ENS resolution is not implemented in this component")).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(mockOnVerified).not.toHaveBeenCalled();

    // Clear the input field
    fireEvent.change(inputField, { target: { value: "" } });

    // Test invalid Ethereum address
    fireEvent.change(inputField, { target: { value: "0xinvalid" } });
    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Invalid Ethereum address format")).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(mockOnVerified).not.toHaveBeenCalled();

    // Test valid Ethereum address
    const validAddress = "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82";
    (useEnsAddress as jest.Mock).mockReturnValue({ data: validAddress, isLoading: false, error: null });
    fireEvent.change(inputField, { target: { value: validAddress } });
    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(getAddress(validAddress));
      expect(verifyButton).toBeEnabled();
    }, { timeout: 5000 });
  });

  it("handles ENS resolution failure for valid Ethereum address", async () => {
    const validAddress = "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82";
    (useEnsAddress as jest.Mock).mockReturnValue({ data: validAddress, isLoading: false, error: null });
    (useEnsName as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: new Error("ENS resolution failed") });
    const mockFetchPoaps = jest.fn().mockResolvedValue([]);
    jest.mock('../utils/fetchPoapsUtil', () => ({
      fetchPoaps: mockFetchPoaps,
    }));

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("0x...");
    fireEvent.change(inputField, { target: { value: validAddress } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(validAddress.toLowerCase());
      expect(mockFetchPoaps).toHaveBeenCalledWith(validAddress.toLowerCase());
      expect(screen.queryByText("Invalid Ethereum address format")).not.toBeInTheDocument();
      expect(verifyButton).toBeEnabled();
    }, { timeout: 5000 });

    // Ensure all state updates have been processed
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });

  it("disables input and button during verification", async () => {
    jest.useFakeTimers();
    const mockAddress = "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82";
    (useEnsAddress as jest.Mock).mockReturnValue({ data: null, isLoading: true, error: null });

    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText("0x...");
    fireEvent.change(inputField, { target: { value: mockAddress } });

    const verifyButton = screen.getByRole("button", { name: /verify/i });
    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(verifyButton).toBeDisabled();
      expect(inputField).toBeDisabled();
      expect(screen.getByText("Verifying...")).toBeInTheDocument();
    }, { timeout: 5000 });

    jest.runAllTimers();
    jest.useRealTimers();
  });
});
