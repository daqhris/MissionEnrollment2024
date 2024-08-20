import dynamic from 'next/dynamic';
import { Address as AddressType } from "viem";
import { Address } from "~~/components/scaffold-eth";

const QRCodeSVG = dynamic<{ value: string; size: number }>(() =>
  import('qrcode.react').then(mod => mod.QRCodeSVG).catch(err => {
    console.error('Failed to load QRCodeSVG:', err);
    return () => <div>QR Code unavailable</div>;
  }),
  { ssr: false, loading: () => <div>Loading QR Code...</div> }
);

type QRCodeSVGProps = { value: string; size: number };

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
                <QRCodeSVG value={address} size={256} />
                <Address address={address} format="long" disableAddressLink />
              </div>
            </div>
          </label>
        </label>
      </div>
    </>
  );
};
