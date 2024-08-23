import React, { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import ContractInput from "./ContractInput";
import { getFunctionInputKey, getInitalTupleFormState } from "./utilsContract";
import { replacer } from "~~/utils/scaffold-eth/common";
import type { AbiParameterTuple } from "~~/utils/scaffold-eth/contract";

type TupleProps = {
  abiTupleParameter: AbiParameterTuple;
  setParentForm: Dispatch<SetStateAction<Record<string, unknown>>>;
  parentStateObjectKey: string;
  parentForm: Record<string, unknown> | undefined;
};

export const Tuple: React.FC<TupleProps> = ({ abiTupleParameter, setParentForm, parentStateObjectKey }): JSX.Element => {
  const [form, setForm] = useState<Record<string, unknown>>(() => getInitalTupleFormState(abiTupleParameter));

  useEffect((): void => {
    const values = Object.values(form);
    const argsStruct: Record<string, unknown> = {};
    abiTupleParameter.components.forEach((component, componentIndex) => {
      argsStruct[component.name || `input_${componentIndex}_`] = values[componentIndex];
    });

    setParentForm(parentForm => ({ ...parentForm, [parentStateObjectKey]: JSON.stringify(argsStruct, replacer) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(form, replacer)]);

  return (
    <div>
      <div className="collapse collapse-arrow bg-base-200 pl-4 py-1.5 border-2 border-secondary">
        <input type="checkbox" className="min-h-fit peer" />
        <div className="collapse-title p-0 min-h-fit peer-checked:mb-2 text-primary-content/50">
          <p className="m-0 p-0 text-[1rem]">{abiTupleParameter.internalType}</p>
        </div>
        <div className="ml-3 flex-col space-y-4 border-secondary/80 border-l-2 pl-4 collapse-content">
          {abiTupleParameter?.components?.map((param, index) => {
            const key = getFunctionInputKey(abiTupleParameter.name || "tuple", param, index);
            return <ContractInput setForm={setForm} form={form} key={key} stateObjectKey={key} paramType={param} />;
          })}
        </div>
      </div>
    </div>
  );
};
