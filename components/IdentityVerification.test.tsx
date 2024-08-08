import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IdentityVerification from './IdentityVerification';

describe('IdentityVerification', () => {
  const mockOnVerified = jest.fn();

  it('renders input field and verify button', () => {
    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText('Enter ENS name or Ethereum address');
    expect(inputField).toBeInTheDocument();

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    expect(verifyButton).toBeInTheDocument();
  });

  it('disables verify button when input is empty', () => {
    render(<IdentityVerification onVerified={mockOnVerified} />);

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    expect(verifyButton).toBeDisabled();
  });

  it('enables verify button when input is not empty', () => {
    render(<IdentityVerification onVerified={mockOnVerified} />);

    const inputField = screen.getByPlaceholderText('Enter ENS name or Ethereum address');
    fireEvent.change(inputField, { target: { value: 'test.eth' } });

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    expect(verifyButton).toBeEnabled();
  });
});
