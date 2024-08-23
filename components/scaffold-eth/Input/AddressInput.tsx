import React, { useCallback, useEffect, useState } from "react";
import { blo } from "blo";
import { useDebounceValue } from "usehooks-ts";
import type { Address } from "viem";
import { isAddress } from "viem";
import { normalize } from "viem/ens";
import { useEnsAddress, useEnsAvatar, useEnsName } from "wagmi";
import type { CommonInputProps } from "~~/components/scaffold-eth";
import { InputBase, isENS } from "~~/components/scaffold-eth";

interface AddressInputProps extends CommonInputProps<Address | string | undefined> {
  value: Address | string | undefined;
  onChange: (newValue: Address | string | undefined) => void;
}

/**
 * Address input with ENS name resolution
 */
export const AddressInput: React.FC<AddressInputProps> = ({ value, name, placeholder, onChange, disabled }) => {
  // Debounce the input to keep clean RPC calls when resolving ENS names
  // If the input is an address, we don't need to debounce it
  const [_debouncedValue] = useDebounceValue(value || '', 500);
  const debouncedValue = value && isAddress(value) ? value : _debouncedValue;
  const isDebouncedValueLive = debouncedValue === value;

  // If the user changes the input after an ENS name is already resolved, we want to remove the stale result
  const settledValue = isDebouncedValueLive ? debouncedValue : undefined;

  const {
    data: ensAddress,
    isLoading: isEnsAddressLoading,
    isError: isEnsAddressError,
    isSuccess: isEnsAddressSuccess,
  } = useEnsAddress({
    name: settledValue,
    chainId: 1,
    query: {
      gcTime: 30_000,
      enabled: isDebouncedValueLive && isENS(debouncedValue),
    },
  });

  const [enteredEnsName, setEnteredEnsName] = useState<string | undefined>();
  const {
    data: ensName,
    isLoading: isEnsNameLoading,
    isError: isEnsNameError,
    isSuccess: isEnsNameSuccess,
  } = useEnsName({
    address: settledValue && isAddress(settledValue) ? (settledValue as Address) : undefined,
    chainId: 1,
    query: {
      enabled: Boolean(settledValue) && isAddress(settledValue as string),
      gcTime: 30_000,
    },
  });

  const { data: ensAvatar, isLoading: isEnsAvatarLoading } = useEnsAvatar({
    name: ensName ? normalize(ensName) : undefined,
    chainId: 1,
    query: {
      enabled: Boolean(ensName),
      gcTime: 30_000,
    },
  });

  // ens => address
  useEffect(() => {
    if (!ensAddress) return;

    // ENS resolved successfully
    setEnteredEnsName(debouncedValue);
    onChange(ensAddress);
  }, [ensAddress, onChange, debouncedValue]);

  const handleChange = useCallback(
    (newValue: Address | string | undefined) => {
      setEnteredEnsName(undefined);
      onChange(newValue);
    },
    [onChange],
  );

  const reFocus =
    isEnsAddressError ||
    isEnsNameError ||
    isEnsNameSuccess ||
    isEnsAddressSuccess ||
    ensName === null ||
    ensAddress === null;

  return (
    <InputBase<string>
      name={name || ''}
      placeholder={placeholder || ''}
      error={ensAddress === null}
      value={typeof value === 'string' ? value : value ? (value as Address).toString() : ''}
      onChange={(newValue) => handleChange(newValue)}
      disabled={isEnsAddressLoading || isEnsNameLoading || disabled || false}
      reFocus={reFocus}
      prefix={
        ensName ? (
          <div className="flex bg-base-300 rounded-l-full items-center">
            {isEnsAvatarLoading && <div className="skeleton bg-base-200 w-[35px] h-[35px] rounded-full shrink-0"></div>}
            {ensAvatar ? (
              <span className="w-[35px]">
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="w-full rounded-full" src={ensAvatar} alt={`${ensAddress ?? ''} avatar`} />
                }
              </span>
            ) : null}
            <span className="text-accent px-2">{enteredEnsName ?? ensName}</span>
          </div>
        ) : (
          (isEnsNameLoading || isEnsAddressLoading) && (
            <div className="flex bg-base-300 rounded-l-full items-center gap-2 pr-2">
              <div className="skeleton bg-base-200 w-[35px] h-[35px] rounded-full shrink-0"></div>
              <div className="skeleton bg-base-200 h-3 w-20"></div>
            </div>
          )
        )
      }
      suffix={
        // Don't want to use nextJS Image here (and adding remote patterns for the URL)
        // eslint-disable-next-line @next/next/no-img-element
        value ? <img alt="" className="!rounded-full" src={blo(value as `0x${string}`)} width="35" height="35" /> : undefined
      }
    />
  );
};
