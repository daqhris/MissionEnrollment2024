import React from 'react';
import type { Address as AddressType } from "viem";
import { Address } from "~~/components/scaffold-eth";
import dynamic from 'next/dynamic';

const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), { ssr: false });

const QRCodeComponent: React.FC<{ value: string; size: number }> = ({ value, size }) => {
  if (typeof window === 'undefined') {
    return null; // Return null during SSR
  }
  return (
    <ErrorBoundary fallback={<div>Error rendering QR Code</div>}>
      {QRCodeSVG && React.createElement(QRCodeSVG, { value, size })}
    </ErrorBoundary>
  );
};

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

type AddressQRCodeModalProps = {
  address: AddressType;
  modalId: string;
};

export const AddressQRCodeModal = ({ address, modalId }: AddressQRCodeModalProps): JSX.Element => {
  return (
    <>
      <div>
        <input type="checkbox" id={`${modalId}`} className="modal-toggle" />
        <label htmlFor={`${modalId}`} className="modal cursor-pointer">
          <label className="modal-box relative">
            {/* dummy input to capture event onclick on modal box */}
            <input className="h-0 w-0 absolute top-0 left-0" />
            <label htmlFor={`${modalId}`} className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
              ✕
            </label>
            <div className="space-y-3 py-6">
              <div className="flex flex-col items-center gap-6">
                <QRCodeComponent value={address} size={256} />
                <Address address={address} format="long" disableAddressLink />
              </div>
            </div>
          </label>
        </label>
      </div>
    </>
  );
};
