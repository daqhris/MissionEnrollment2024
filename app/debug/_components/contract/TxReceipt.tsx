import React, { useState } from "react";
import { DisplayContent } from "./utilsDisplay";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { TransactionReceipt } from "viem";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { ObjectFieldDisplay } from "~~/app/debug/_components/contract";
import { replacer } from "~~/utils/scaffold-eth/common";

export const TxReceipt: React.FC<{ txResult: TransactionReceipt }> = ({ txResult }): JSX.Element => {
  const [txResultCopied, setTxResultCopied] = useState<boolean>(false);

  return (
    <div className="flex text-sm rounded-3xl peer-checked:rounded-b-none min-h-0 bg-secondary py-0">
      <div className="mt-1 pl-2">
        {txResultCopied ? (
          <CheckCircleIcon
            className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
            aria-hidden="true"
          />
        ) : (
          <CopyToClipboard
            text={JSON.stringify(txResult, replacer, 2)}
            onCopy={(): void => {
              setTxResultCopied(true);
              setTimeout((): void => {
                setTxResultCopied(false);
              }, 800);
            }}
          >
            <DocumentDuplicateIcon
              className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
              aria-hidden="true"
            />
          </CopyToClipboard>
        )}
      </div>
      <div className="flex-wrap collapse collapse-arrow">
        <input type="checkbox" className="min-h-0 peer" />
        <div className="collapse-title text-sm min-h-0 py-1.5 pl-1">
          <strong>Transaction Receipt</strong>
        </div>
        <div className="collapse-content overflow-auto bg-secondary rounded-t-none rounded-3xl !pl-0">
          <pre className="text-xs">
            {Object.entries(txResult).map(([k, v]) => (
              <ObjectFieldDisplay key={k} name={k} value={v as DisplayContent} size="xs" leftPad={false} />
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};
