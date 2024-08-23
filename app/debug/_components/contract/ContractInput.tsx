"use client";

import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { Tuple } from "./Tuple";
import { TupleArray } from "./TupleArray";
import type { AbiParameter } from "viem";
import {
  AddressInput,
  Bytes32Input,
  BytesInput,
  InputBase,
  IntegerInput,
  IntegerVariant,
} from "~~/components/scaffold-eth";
import type { CommonInputProps } from "~~/components/scaffold-eth";
import type { AbiParameterTuple } from "~~/utils/scaffold-eth/contract";

interface ContractInputProps {
  setForm: Dispatch<SetStateAction<Record<string, unknown>>>;
  form: Record<string, unknown>;
  stateObjectKey: string;
  paramType: AbiParameter;
}

type InputValue = string | bigint | undefined;

/**
 * Generic Input component to handle inputs based on their function param type
 */
const ContractInput: React.FC<ContractInputProps> = ({ setForm, form, stateObjectKey, paramType }): JSX.Element => {
  const inputProps: CommonInputProps<InputValue> = {
    name: stateObjectKey,
    value: form[stateObjectKey] as InputValue,
    placeholder: paramType.name ? `${paramType.type} ${paramType.name}` : paramType.type,
    onChange: (value: InputValue): void => {
      setForm((prevForm: Record<string, unknown>): Record<string, unknown> => ({ ...prevForm, [stateObjectKey]: value }));
    },
  };

  const renderDefaultInput = (): JSX.Element => {
    if (paramType.type.includes("int") && !paramType.type.includes("[")) {
      return (
        <IntegerInput
          {...inputProps}
          variant={paramType.type as IntegerVariant}
          value={inputProps.value as string | bigint}
        />
      );
    } else if (paramType.type.startsWith("tuple[")) {
      return (
        <TupleArray
          setParentForm={setForm}
          parentForm={form}
          abiTupleParameter={paramType as AbiParameterTuple}
          parentStateObjectKey={stateObjectKey}
        />
      );
    } else {
      return <InputBase {...inputProps} />;
    }
  };

  const renderInput = (): JSX.Element => {
    switch (paramType.type) {
      case "address":
        return (
          <AddressInput
            {...inputProps}
            value={inputProps.value?.toString() ?? ""}
            onChange={(value: string | undefined): void => inputProps.onChange(value)}
          />
        );
      case "bytes32":
        return (
          <Bytes32Input
            {...inputProps}
            value={inputProps.value?.toString() ?? ""}
            onChange={(value: string): void => inputProps.onChange(value)}
          />
        );
      case "bytes":
        return (
          <BytesInput
            {...inputProps}
            value={inputProps.value?.toString() ?? ""}
            onChange={(value: string): void => inputProps.onChange(value)}
          />
        );
      case "string":
        return <InputBase {...inputProps} />;
      case "tuple":
        return (
          <Tuple
            setParentForm={setForm}
            parentForm={form}
            abiTupleParameter={paramType as AbiParameterTuple}
            parentStateObjectKey={stateObjectKey}
          />
        );
      default:
        return renderDefaultInput();
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center ml-2">
        {paramType.name && <span className="text-xs font-medium mr-2 leading-none">{paramType.name}</span>}
        <span className="block text-xs font-extralight leading-none">{paramType.type}</span>
      </div>
      {renderInput()}
    </div>
  );
};

export default ContractInput;
