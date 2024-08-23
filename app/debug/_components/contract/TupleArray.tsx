import React, { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import ContractInput from "./ContractInput";
import { getFunctionInputKey, getInitalTupleArrayFormState } from "./utilsContract";
import { replacer } from "~~/utils/scaffold-eth/common";
import type { AbiParameterTuple } from "~~/utils/scaffold-eth/contract";

type TupleArrayProps = {
  abiTupleParameter: AbiParameterTuple & { isVirtual?: true };
  setParentForm: Dispatch<SetStateAction<Record<string, unknown>>>;
  parentStateObjectKey: string;
  parentForm: Record<string, unknown> | undefined;
};

export const TupleArray: React.FC<TupleArrayProps> = ({ abiTupleParameter, setParentForm, parentStateObjectKey }): JSX.Element => {
  const [form, setForm] = useState<Record<string, unknown>>(() => getInitalTupleArrayFormState(abiTupleParameter));
  const [additionalInputs, setAdditionalInputs] = useState<Array<typeof abiTupleParameter.components>>([
    abiTupleParameter.components,
  ]);

  const depth = (abiTupleParameter.type.match(/\[\]/g) || []).length;

  useEffect((): void => {
    const groupFields = (form: Record<string, unknown>): Record<string, Record<string, unknown>> => {
      return Object.entries(form).reduce<Record<string, Record<string, unknown>>>((acc, [key, value]) => {
        const [indexPrefix, ...restArray] = key.split("_");
        const componentName = restArray.join("_");
        if (indexPrefix?.trim()) {
          acc[indexPrefix] = { ...acc[indexPrefix] ?? {}, [componentName]: value };
        }
        return acc;
      }, {});
    };

    const createArgsArray = (groupedFields: Record<string, Record<string, unknown>>): Array<Record<string, unknown>> => {
      return Object.values(groupedFields).map(group =>
        abiTupleParameter.components.reduce((argsStruct, component, index) => {
          const key = component.name || `input_${index}_`;
          if (group[key] !== undefined) {
            argsStruct[key] = group[key];
          }
          return argsStruct;
        }, {} as Record<string, unknown>)
      );
    };

    const processArgsArray = (argsArray: Array<Record<string, unknown>>): Array<Record<string, unknown>> => {
      if (depth <= 1) return argsArray;
      const firstComponentName = abiTupleParameter.components[0]?.name || "tuple";
      return argsArray.map(args => {
        const firstComponent = args[firstComponentName];
        return (firstComponent && typeof firstComponent === 'object') ? firstComponent as Record<string, unknown> : {};
      });
    };

    const groupedFields = groupFields(form);
    const argsArray = createArgsArray(groupedFields);
    const processedArgsArray = processArgsArray(argsArray);

    setParentForm(prevForm => ({
      ...prevForm,
      [parentStateObjectKey]: JSON.stringify(processedArgsArray, replacer)
    }));
  }, [form, abiTupleParameter.components, depth, parentStateObjectKey, setParentForm]);

  const addInput = (): void => {
    setAdditionalInputs(previousValue => {
      const newAdditionalInputs = [...previousValue, abiTupleParameter.components];

      // Add the new inputs to the form
      setForm(form => {
        const newForm = { ...form };
        abiTupleParameter.components.forEach((component, componentIndex) => {
          const key = getFunctionInputKey(
            `${newAdditionalInputs.length - 1}_${abiTupleParameter.name || "tuple"}`,
            component,
            componentIndex,
          );
          newForm[key] = "";
        });
        return newForm;
      });

      return newAdditionalInputs;
    });
  };

  const removeInput = (): void => {
    // Remove the last inputs from the form
    setForm(form => {
      const newForm = { ...form };
      abiTupleParameter.components.forEach((component, componentIndex) => {
        const key = getFunctionInputKey(
          `${additionalInputs.length - 1}_${abiTupleParameter.name || "tuple"}`,
          component,
          componentIndex,
        );
        delete newForm[key];
      });
      return newForm;
    });
    setAdditionalInputs(inputs => inputs.slice(0, -1));
  };

  return (
    <div>
      <div className="collapse collapse-arrow bg-base-200 pl-4 py-1.5 border-2 border-secondary">
        <input type="checkbox" className="min-h-fit peer" />
        <div className="collapse-title p-0 min-h-fit peer-checked:mb-1 text-primary-content/50">
          <p className="m-0 text-[1rem]">{abiTupleParameter.internalType}</p>
        </div>
        <div className="ml-3 flex-col space-y-2 border-secondary/70 border-l-2 pl-4 collapse-content">
          {additionalInputs.map((additionalInput, additionalIndex) => (
            <div key={additionalIndex} className="space-y-1">
              <span className="badge bg-base-300 badge-sm">
                {depth > 1 ? `${additionalIndex}` : `tuple[${additionalIndex}]`}
              </span>
              <div className="space-y-4">
                {additionalInput.map((param, index) => {
                  const key = getFunctionInputKey(
                    `${additionalIndex}_${abiTupleParameter.name || "tuple"}`,
                    param,
                    index,
                  );
                  return (
                    <ContractInput setForm={setForm} form={form} key={key} stateObjectKey={key} paramType={param} />
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex space-x-2">
            <button className="btn btn-sm btn-secondary" onClick={addInput}>
              +
            </button>
            {additionalInputs.length > 0 && (
              <button className="btn btn-sm btn-secondary" onClick={removeInput}>
                -
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
