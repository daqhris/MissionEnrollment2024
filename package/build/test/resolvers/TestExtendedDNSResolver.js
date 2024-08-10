import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers.js';
import { expect } from 'chai';
import hre from 'hardhat';
import { bytesToHex, encodeFunctionData, namehash, stringToHex, } from 'viem';
import { packetToBytes } from '../fixtures/dnsEncodeName.js';
async function fixture() {
    const resolver = await hre.viem.deployContract('ExtendedDNSResolver', []);
    const { abi: publicResolverAbi } = await hre.artifacts.readArtifact('PublicResolver');
    async function resolve({ name, context, ...encodeParams }) {
        const node = namehash(name);
        const callData = encodeFunctionData({
            abi: publicResolverAbi,
            functionName: encodeParams.functionName,
            args: [node, ...encodeParams.args],
        });
        return resolver.read.resolve([
            bytesToHex(packetToBytes(name)),
            callData,
            stringToHex(context),
        ]);
    }
    return { resolver, resolve };
}
describe('ExtendedDNSResolver', () => {
    describe('a records', async () => {
        it('resolves Ethereum addresses using addr(bytes32)', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            const testAddress = '0xfefeFEFeFEFEFEFEFeFefefefefeFEfEfefefEfe';
            await expect(resolve({
                name,
                functionName: 'addr',
                args: [],
                context: `a[60]=${testAddress}`,
            })).resolves.toEqual(testAddress.toLowerCase());
        });
        it('resolves Ethereum addresses using addr(bytes32,uint256)', async () => {
            const { resolve } = await loadFixture(fixture);
            const coinType = 60n;
            const name = 'test.test';
            const testAddress = '0xfefeFEFeFEFEFEFEFeFefefefefeFEfEfefefEfe';
            await expect(resolve({
                name,
                functionName: 'addr',
                args: [coinType],
                context: `a[60]=${testAddress}`,
            })).resolves.toEqual(testAddress.toLowerCase());
        });
        it('ignores records with the wrong cointype', async () => {
            const { resolve } = await loadFixture(fixture);
            const coinType = 0n;
            const name = 'test.test';
            const testAddress = '0xfefeFEFeFEFEFEFEFeFefefefefeFEfEfefefEfe';
            await expect(resolve({
                name,
                functionName: 'addr',
                args: [coinType],
                context: `a[60]=${testAddress}`,
            })).resolves.toEqual('0x');
        });
        it('raises an error for invalid hex data', async () => {
            const { resolver, resolve } = await loadFixture(fixture);
            const name = 'test.test';
            const testAddress = '0xfoobar';
            await expect(resolver)
                .transaction(resolve({
                name,
                functionName: 'addr',
                args: [],
                context: `a[60]=${testAddress}`,
            }))
                .toBeRevertedWithCustomError('InvalidAddressFormat');
        });
        it('works if the record comes after an unrelated one', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            const testAddress = '0xfefeFEFeFEFEFEFEFeFefefefefeFEfEfefefEfe';
            await expect(resolve({
                name,
                functionName: 'addr',
                args: [],
                context: `foo=bar a[60]=${testAddress}`,
            })).resolves.toEqual(testAddress.toLowerCase());
        });
        it('handles multiple spaces between records', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            const testAddress = '0xfefeFEFeFEFEFEFEFeFefefefefeFEfEfefefEfe';
            await expect(resolve({
                name,
                functionName: 'addr',
                args: [],
                context: `foo=bar  a[60]=${testAddress}`,
            })).resolves.toEqual(testAddress.toLowerCase());
        });
        it('handles multiple spaces between quoted records', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            const testAddress = '0xfefeFEFeFEFEFEFEFeFefefefefeFEfEfefefEfe';
            await expect(resolve({
                name,
                functionName: 'addr',
                args: [],
                context: `foo='bar'  a[60]=${testAddress}`,
            })).resolves.toEqual(testAddress.toLowerCase());
        });
        it('handles no spaces between quoted records', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            const testAddress = '0xfefeFEFeFEFEFEFEFeFefefefefeFEfEfefefEfe';
            await expect(resolve({
                name,
                functionName: 'addr',
                args: [],
                context: `foo='bar'a[60]=${testAddress}`,
            })).resolves.toEqual(testAddress.toLowerCase());
        });
        it('works if the record comes after one for another cointype', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            const testAddress = '0xfefeFEFeFEFEFEFEFeFefefefefeFEfEfefefEfe';
            await expect(resolve({
                name,
                functionName: 'addr',
                args: [],
                context: `a[0]=0x1234 a[60]=${testAddress}`,
            })).resolves.toEqual(testAddress.toLowerCase());
        });
        it('uses the first matching record it finds', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            const testAddress = '0xfefeFEFeFEFEFEFEFeFefefefefeFEfEfefefEfe';
            await expect(resolve({
                name,
                functionName: 'addr',
                args: [],
                context: `a[60]=${testAddress} a[60]=0x1234567890123456789012345678901234567890`,
            })).resolves.toEqual(testAddress.toLowerCase());
        });
        it('resolves addresses with coin types', async () => {
            const { resolve } = await loadFixture(fixture);
            const optimismChainId = 10;
            const optimismCoinType = BigInt((0x80000000 | optimismChainId) >>> 0);
            const name = 'test.test';
            const testAddress = '0xfefeFEFeFEFEFEFEFeFefefefefeFEfEfefefEfe';
            await expect(resolve({
                name,
                functionName: 'addr',
                args: [optimismCoinType],
                context: `a[e${optimismChainId}]=${testAddress}`,
            })).resolves.toEqual(testAddress.toLowerCase());
        });
    });
    describe('t records', () => {
        it('decodes an unquoted t record', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            await expect(resolve({
                name,
                functionName: 'text',
                args: ['com.twitter'],
                context: 't[com.twitter]=nicksdjohnson',
            })).resolves.toEqual(stringToHex('nicksdjohnson'));
        });
        it('returns 0x for a missing key', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            await expect(resolve({
                name,
                functionName: 'text',
                args: ['com.discord'],
                context: 't[com.twitter]=nicksdjohnson',
            })).resolves.toEqual('0x');
        });
        it('decodes a quoted t record', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            await expect(resolve({
                name,
                functionName: 'text',
                args: ['url'],
                context: "t[url]='https://ens.domains/'",
            })).resolves.toEqual(stringToHex('https://ens.domains/'));
        });
        it('handles escaped quotes', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            await expect(resolve({
                name,
                functionName: 'text',
                args: ['note'],
                context: "t[note]='I\\'m great'",
            })).resolves.toEqual(stringToHex("I'm great"));
        });
        it('rejects a record with an unterminated quoted string', async () => {
            const { resolve } = await loadFixture(fixture);
            const name = 'test.test';
            await expect(resolve({
                name,
                functionName: 'text',
                args: ['note'],
                context: "t[note]='I\\'m great",
            })).resolves.toEqual('0x');
        });
    });
});
