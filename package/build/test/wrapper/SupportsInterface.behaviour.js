// Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.1.0/test/token/ERC1155/ERC1155.behaviour.js
// Copyright (c) 2016-2020 zOS Global Limited
import { expect } from 'chai';
import hre from 'hardhat';
import { encodeFunctionData, getAbiItem, toFunctionSelector, toFunctionSignature, } from 'viem';
import { createInterfaceId } from '../fixtures/createInterfaceId.js';
/**
 * @description Matches a function signature string to an exact ABI function.
 *
 * - Required to ensure that the ABI function is an **exact** match for the string, avoiding any potential mismatches.
 *
 * @param {Object} params
 * @param {Abi} params.artifactAbi - The ABI of the interface artifact
 * @param {string} params.fnString - The function signature string to match
 * @returns
 */
const matchStringFunctionToAbi = ({ artifactAbi, fnString, }) => {
    // Extract the function name from the function signature string
    const name = fnString.match(/(?<=function ).*?(?=\()/)[0];
    // Find all functions with the same name
    let matchingFunctions = artifactAbi.filter((abi) => abi.type === 'function' && abi.name === name);
    // If there is only one function with the same name, return it
    if (matchingFunctions.length === 1)
        return matchingFunctions[0];
    // Extract the input types as strings from the function signature string
    const inputStrings = fnString
        .match(/(?<=\().*?(?=\))/)[0]
        .split(',')
        .map((x) => x.trim());
    // Filter out functions with a different number of inputs
    matchingFunctions = matchingFunctions.filter((abi) => abi.inputs.length === inputStrings.length);
    // If there is only one function with the same number of inputs, return it
    if (matchingFunctions.length === 1)
        return matchingFunctions[0];
    // Parse the input strings into input type/name
    const parsedInputs = inputStrings.map((x) => {
        const [type, name] = x.split(' ');
        return { type, name };
    });
    // Filter out functions with different input types
    matchingFunctions = matchingFunctions.filter((abi) => {
        for (let i = 0; i < abi.inputs.length; i++) {
            const current = parsedInputs[i];
            const reference = abi.inputs[i];
            // Standard match for most cases (e.g. 'uint256' === 'uint256')
            if (reference.type === current.type)
                continue;
            if ('internalType' in reference && reference.internalType) {
                // Internal types that are equal
                if (reference.internalType === current.type)
                    continue;
                // Internal types that are effectively equal (e.g. 'contract INameWrapperUpgrade' === 'INameWrapperUpgrade')
                // Multiple internal type aliases can't exist in the same contract, so this is safe
                const internalTypeName = reference.internalType.split(' ')[1];
                if (internalTypeName === current.type)
                    continue;
            }
            // Not matching
            return false;
        }
        // 0 length input - matched by default since the filter for input length already passed
        return true;
    });
    // If there is only one function with the same inputs, return it
    if (matchingFunctions.length === 1)
        return matchingFunctions[0];
    throw new Error(`Could not find matching function for ${fnString}`);
};
/**
 * @description Gets the interface ABI that would be used in Solidity
 *
 * - This function is required since `type(INameWrapper).interfaceId` in Solidity uses **only the function signatures explicitly defined in the interface**. The value for it however can't be derived from any Solidity output?!?!
 *
 * @param interfaceName - The name of the interface to get the ABI for
 * @returns The explicitly defined ABI for the interface
 */
const getSolidityReferenceInterfaceAbi = async (interfaceName) => {
    const artifact = await hre.artifacts.readArtifact(interfaceName);
    const fullyQualifiedNames = await hre.artifacts.getAllFullyQualifiedNames();
    const fullyQualifiedInterfaceName = fullyQualifiedNames.find((n) => n.endsWith(interfaceName));
    if (!fullyQualifiedInterfaceName)
        throw new Error("Couldn't find fully qualified interface name");
    const buildInfo = await hre.artifacts.getBuildInfo(fullyQualifiedInterfaceName);
    if (!buildInfo)
        throw new Error("Couldn't find build info for interface");
    const path = fullyQualifiedInterfaceName.split(':')[0];
    const buildMetadata = JSON.parse(buildInfo.output.contracts[path][interfaceName].metadata);
    const { content } = buildMetadata.sources[path];
    return (content
        // Remove comments - single and multi-line
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')
        // Match only the interface block + nested curly braces
        .match(`interface ${interfaceName} .*?{(?:\{??[^{]*?})+`)[0]
        // Remove the interface keyword and the interface name
        .replace(/.*{/s, '')
        // Remove the closing curly brace
        .replace(/}$/s, '')
        // Match array of all function signatures
        .match(/function .*?;/gs)
        // Remove newlines and trailing semicolons
        .map((fn) => fn
        .split('\n')
        .map((l) => l.trim())
        .join('')
        .replace(/;$/, ''))
        // Match the function signature string to the exact ABI function
        .map((fnString) => matchStringFunctionToAbi({
        artifactAbi: artifact.abi,
        fnString,
    })));
};
export const shouldSupportInterfaces = ({ contract, interfaces, }) => {
    let deployedContract;
    before(async () => {
        deployedContract = await contract();
    });
    describe('Contract interface', function () {
        for (const interfaceName of interfaces) {
            describe(interfaceName, function () {
                let interfaceAbi;
                let interfaceId;
                before(async () => {
                    interfaceAbi = await getSolidityReferenceInterfaceAbi(interfaceName);
                    interfaceId = createInterfaceId(interfaceAbi);
                    for (const fn of interfaceAbi) {
                        const sig = toFunctionSignature(fn);
                        const selector = toFunctionSelector(fn);
                        this.addTest(it(`implements ${sig}`, () => {
                            expect(getAbiItem({ abi: deployedContract.abi, name: selector })).not.toBeUndefined();
                        }));
                    }
                });
                describe("ERC165's supportsInterface(bytes4)", () => {
                    it('uses less than 30k gas [skip-on-coverage]', async () => {
                        const publicClient = await hre.viem.getPublicClient();
                        await expect(publicClient.estimateGas({
                            to: deployedContract.address,
                            data: encodeFunctionData({
                                abi: deployedContract.abi,
                                functionName: 'supportsInterface',
                                args: [interfaceId],
                            }),
                        })).resolves.toBeLessThan(30000n);
                    });
                    it('claims support', async () => {
                        await expect(deployedContract.read.supportsInterface([interfaceId])).resolves.toBe(true);
                    });
                });
            });
        }
    });
};
