import { useCallback } from "react";
import { bytesToString, isHex, toBytes, toHex } from "viem";
import type { CommonInputProps } from "~~/components/scaffold-eth";
import { InputBase } from "~~/components/scaffold-eth";

export const BytesInput = ({ value, onChange, name, placeholder, disabled }: CommonInputProps<string>): JSX.Element => {
  const convertStringToBytes = useCallback((): void => {
    if (value) {
      onChange(isHex(value) ? bytesToString(toBytes(value)) : toHex(toBytes(value)));
    }
  }, [onChange, value]);

  return (
    <InputBase<string>
      name={name || ''}
      value={value || ''}
      placeholder={placeholder || ''}
      onChange={onChange}
      disabled={disabled || false}
      suffix={
        <div
          className="self-center cursor-pointer text-xl font-semibold px-4 text-accent"
          onClick={convertStringToBytes}
        >
          #
        </div>
      }
    />
  );
};
