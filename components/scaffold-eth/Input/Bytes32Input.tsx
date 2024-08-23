import { useCallback } from "react";
import { hexToString, isHex, stringToHex } from "viem";
import type { CommonInputProps } from "~~/components/scaffold-eth";
import { InputBase } from "~~/components/scaffold-eth";

export const Bytes32Input = ({ value, onChange, name, placeholder, disabled }: CommonInputProps<string>): JSX.Element => {
  const convertStringToBytes32 = useCallback((): void => {
    if (!value) {
      return;
    }
    onChange(isHex(value) ? hexToString(value, { size: 32 }) : stringToHex(value, { size: 32 }));
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
          onClick={convertStringToBytes32}
        >
          #
        </div>
      }
    />
  );
};
