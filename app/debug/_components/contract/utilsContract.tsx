import type { AbiFunction, AbiParameter } from "viem";
import type { AbiParameterTuple } from "~~/utils/scaffold-eth/contract";

/**
 * Generates a key based on function metadata
 */
const getFunctionInputKey = (functionName: string, input: AbiParameter, inputIndex: number): string => {
  const name = input?.name || `input_${inputIndex}_`;
  return functionName + "_" + name + "_" + input.internalType + "_" + input.type;
};

const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// Recursive function to deeply parse JSON strings, correctly handling nested arrays and encoded JSON strings
const deepParseValues = (value: unknown): unknown => {
  if (typeof value === "string") {
    if (isJsonString(value)) {
      const parsed = JSON.parse(value);
      return deepParseValues(parsed);
    } else {
      // It's a string but not a JSON string, return as is
      return value;
    }
  } else if (Array.isArray(value)) {
    // If it's an array, recursively parse each element
    return value.map(element => deepParseValues(element));
  } else if (typeof value === "object" && value !== null) {
    // If it's an object, recursively parse each value
    return Object.entries(value).reduce((acc: Record<string, unknown>, [key, val]) => {
      acc[key] = deepParseValues(val);
      return acc;
    }, {});
  }

  // Handle boolean values represented as strings
  if (value === "true" || value === "1" || value === "0x1" || value === "0x01" || value === "0x0001") {
    return true;
  } else if (value === "false" || value === "0" || value === "0x0" || value === "0x00" || value === "0x0000") {
    return false;
  }

  return value;
};

/**
 * parses form input with array support
 */
const getParsedContractFunctionArgs = (form: Record<string, unknown>): unknown[] => {
  return Object.keys(form).map(key => {
    const valueOfArg = form[key];

    // Attempt to deeply parse JSON strings
    return deepParseValues(valueOfArg);
  });
};

const getInitialFormState = (abiFunction: AbiFunction): Record<string, string> => {
  const initialForm: Record<string, string> = {};
  if (!abiFunction.inputs) return initialForm;
  abiFunction.inputs.forEach((input: AbiParameter, inputIndex: number) => {
    const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
    initialForm[key] = "";
  });
  return initialForm;
};

const getInitalTupleFormState = (abiTupleParameter: AbiParameterTuple): Record<string, string> => {
  const initialForm: Record<string, string> = {};
  if (abiTupleParameter.components.length === 0) return initialForm;

  abiTupleParameter.components.forEach((component: AbiParameter, componentIndex: number) => {
    const key = getFunctionInputKey(abiTupleParameter.name || "tuple", component, componentIndex);
    initialForm[key] = "";
  });
  return initialForm;
};

const getInitalTupleArrayFormState = (abiTupleParameter: AbiParameterTuple): Record<string, string> => {
  const initialForm: Record<string, string> = {};
  if (abiTupleParameter.components.length === 0) return initialForm;
  abiTupleParameter.components.forEach((component: AbiParameter, componentIndex: number) => {
    const key = getFunctionInputKey("0_" + (abiTupleParameter.name || "tuple"), component, componentIndex);
    initialForm[key] = "";
  });
  return initialForm;
};

const adjustInput = (input: AbiParameterTuple): AbiParameter => {
  if (input.type.startsWith("tuple[")) {
    const depth = (input.type.match(/\[\]/g) || []).length;
    return {
      ...input,
      components: transformComponents(input.components, depth, {
        internalType: input.internalType,
        name: input.name,
      } as { internalType?: string; name?: string }),
    };
  } else if (input.components) {
    return {
      ...input,
      components: input.components.map((value) => adjustInput(value as AbiParameterTuple)),
    };
  }
  return input;
};

const transformComponents = (
  components: readonly AbiParameter[],
  depth: number,
  parentComponentData: { internalType?: string; name?: string },
): AbiParameter[] => {
  // Base case: if depth is 1 or no components, return the original components
  if (depth === 1 || !components) {
    return [...components];
  }

  // Recursive case: wrap components in an additional tuple layer
  const wrappedComponents: AbiParameter = {
    internalType: `${parentComponentData.internalType || "struct"}`.replace(/\[\]/g, "") + "[]".repeat(depth - 1),
    name: `${parentComponentData.name || "tuple"}`,
    type: `tuple${"[]".repeat(depth - 1)}`,
    components: transformComponents(components, depth - 1, parentComponentData),
  };

  return [wrappedComponents];
};

const transformAbiFunction = (abiFunction: AbiFunction): AbiFunction => {
  return {
    ...abiFunction,
    inputs: abiFunction.inputs.map((value: AbiParameter) => adjustInput(value as AbiParameterTuple)),
  };
};

export {
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs,
  getInitalTupleFormState,
  getInitalTupleArrayFormState,
  transformAbiFunction,
};
