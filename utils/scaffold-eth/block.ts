import type { Block, Transaction, TransactionReceipt } from "viem";

export type TransactionWithFunction = Transaction & {
  functionName?: string;
  functionArgs?: unknown[];
  functionArgNames?: string[];
  functionArgTypes?: string[];
};

type TransactionReceipts = {
  [key: string]: TransactionReceipt;
};

export type TransactionsTableProps = {
  blocks: Block[];
  transactionReceipts: TransactionReceipts;
};
