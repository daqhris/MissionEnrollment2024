import { useCallback, useEffect, useState } from "react";
import type {
  Block,
  Hash,
  Transaction,
  TransactionReceipt,
} from "viem";
import {
  createTestClient,
  publicActions,
  walletActions,
  webSocket,
} from "viem";
import { hardhat } from "viem/chains";
import { decodeTransactionData } from "~~/utils/scaffold-eth";

const BLOCKS_PER_PAGE = 20;

export const testClient = createTestClient({
  chain: hardhat,
  mode: "hardhat",
  transport: webSocket("ws://127.0.0.1:8545"),
})
  .extend(publicActions)
  .extend(walletActions);

// Define the return type of the hook for better type inference
type UseFetchBlocksReturn = {
  blocks: Block[];
  transactionReceipts: Record<string, TransactionReceipt>;
  currentPage: number;
  totalBlocks: bigint;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  error: Error | null;
};

export const useFetchBlocks = (): UseFetchBlocksReturn => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactionReceipts, setTransactionReceipts] = useState<Record<string, TransactionReceipt>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState<bigint>(0n);
  const [error, setError] = useState<Error | null>(null);

  const fetchBlocks = useCallback(async (): Promise<void> => {
    setError(null);

    try {
      const blockNumber = await testClient.getBlockNumber();
      setTotalBlocks(blockNumber);

      const startingBlock = blockNumber - BigInt(currentPage * BLOCKS_PER_PAGE);
      const blockNumbersToFetch = Array.from(
        { length: Number(BLOCKS_PER_PAGE < startingBlock + 1n ? BLOCKS_PER_PAGE : startingBlock + 1n) },
        (_, i) => startingBlock - BigInt(i),
      );

      const blocksWithTransactions = await Promise.all(blockNumbersToFetch.map(async (blockNumber): Promise<Block> => {
        const block = await testClient.getBlock({ blockNumber, includeTransactions: true });
        if (!block) {
          throw new Error(`Failed to fetch block ${blockNumber}`);
        }
        return block;
      }));

      // Decode transaction data for each block
      blocksWithTransactions.forEach(block => {
        block.transactions.forEach(tx => {
          if (typeof tx !== 'string') {
            decodeTransactionData(tx);
          }
        });
      });

      const txReceipts = await Promise.all(
        blocksWithTransactions.flatMap(block =>
          block.transactions.map(async (tx): Promise<Record<string, TransactionReceipt>> => {
            if (typeof tx === 'string') {
              throw new Error(`Unexpected string transaction hash: ${tx}`);
            }
            const receipt = await testClient.getTransactionReceipt({ hash: tx.hash });
            if (!receipt) {
              throw new Error(`Failed to fetch receipt for transaction ${tx.hash}`);
            }
            return { [tx.hash]: receipt };
          }),
        ),
      );

      setBlocks(blocksWithTransactions);
      setTransactionReceipts(prevReceipts => ({ ...prevReceipts, ...Object.assign({}, ...txReceipts) }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`An error occurred: ${String(err)}`));
    }
  }, [currentPage]);

  useEffect(() => {
    void fetchBlocks();
  }, [fetchBlocks]);

  useEffect(() => {
    const handleNewBlock = async (newBlock: Block): Promise<void> => {
      try {
        if (currentPage === 0) {
          // Fetch full transaction details for the new block
          const transactionsDetails = await Promise.all(
            newBlock.transactions.map(async (tx): Promise<Transaction> => {
              if (typeof tx === 'string') {
                const transaction = await testClient.getTransaction({ hash: tx });
                if (!transaction) {
                  throw new Error(`Failed to fetch transaction ${tx}`);
                }
                return transaction;
              }
              return tx;
            }),
          );
          newBlock.transactions = transactionsDetails;

          // Decode transaction data
          newBlock.transactions.forEach((tx) => {
            if (typeof tx !== 'string') {
              decodeTransactionData(tx);
            }
          });

          // Fetch transaction receipts
          const receipts = await Promise.all(
            newBlock.transactions.map(async (tx): Promise<Record<string, TransactionReceipt>> => {
              if (typeof tx === 'string') {
                throw new Error(`Unexpected string transaction hash: ${tx}`);
              }
              const receipt = await testClient.getTransactionReceipt({ hash: tx.hash });
              if (!receipt) {
                throw new Error(`Failed to fetch receipt for transaction ${tx.hash}`);
              }
              return { [tx.hash]: receipt };
            }),
          );

          // Update state with new block and receipts
          setBlocks(prevBlocks => [newBlock, ...prevBlocks.slice(0, BLOCKS_PER_PAGE - 1)]);
          setTransactionReceipts(prevReceipts => ({ ...prevReceipts, ...Object.assign({}, ...receipts) }));
        }

        // Update total blocks count
        if (newBlock.number) {
          setTotalBlocks(newBlock.number);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`An error occurred: ${String(err)}`));
      }
    };

    // Watch for new blocks
    return testClient.watchBlocks({ onBlock: handleNewBlock, includeTransactions: true });
  }, [currentPage]);

  return {
    blocks,
    transactionReceipts,
    currentPage,
    totalBlocks,
    setCurrentPage,
    error,
  };
};
