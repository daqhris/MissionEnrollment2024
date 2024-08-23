import React, { useState } from "react";
import type { ReactElement } from "react";
import PropTypes from "prop-types";
import { formatEther, isAddress, isHex } from "viem";
import type { Log, TransactionBase, TransactionReceipt } from "viem";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { Address } from "~~/components/scaffold-eth";
import { replacer } from "~~/utils/scaffold-eth/common";

export type DisplayContent =
  | string
  | number
  | bigint
  | Record<string, unknown>
  | TransactionBase
  | TransactionReceipt
  | Log[]
  | null
  | undefined;

type ResultFontSize = "sm" | "base" | "xs" | "lg" | "xl" | "2xl" | "3xl";

export const displayTxResult = (
  displayContent: DisplayContent | DisplayContent[],
  fontSize: ResultFontSize = "base",
): string | ReactElement | number | JSX.Element => {
  if (displayContent == null) {
    return "";
  }

  if (typeof displayContent === "bigint") {
    return <NumberDisplay value={displayContent} />;
  }

  if (typeof displayContent === "string") {
    if (isAddress(displayContent)) {
      return <Address address={displayContent} size={fontSize} />;
    }

    if (isHex(displayContent)) {
      return displayContent; // don't add quotes
    }
  }

  if (Array.isArray(displayContent)) {
    return <ArrayDisplay values={displayContent} size={fontSize} />;
  }

  if (typeof displayContent === "object" && displayContent !== null) {
    return <StructDisplay struct={displayContent as Record<string, unknown>} size={fontSize} />;
  }

  return JSON.stringify(displayContent, replacer, 2);
};

const NumberDisplay: React.FC<{ value: bigint }> = ({ value }): JSX.Element => {
  const [isEther, setIsEther] = useState(false);

  const asNumber = Number(value);
  if (asNumber <= Number.MAX_SAFE_INTEGER && asNumber >= Number.MIN_SAFE_INTEGER) {
    return <>{String(value)}</>;
  }

  return (
    <div className="flex items-baseline">
      {isEther ? "Ξ" + formatEther(value) : String(value)}
      <span
        className="tooltip tooltip-secondary font-sans ml-2"
        data-tip={isEther ? "Multiply by 1e18" : "Divide by 1e18"}
      >
        <button className="btn btn-ghost btn-circle btn-xs" onClick={(): void => setIsEther(!isEther)}>
          <ArrowsRightLeftIcon className="h-3 w-3 opacity-65" />
        </button>
      </span>
    </div>
  );
};

export const ObjectFieldDisplay: React.FC<{
  name: string;
  value: DisplayContent;
  size: ResultFontSize;
  leftPad?: boolean;
}> = ({ name, value, size, leftPad = true }) => {
  return (
    <div className={`flex flex-row items-baseline ${leftPad ? "ml-4" : ""}`}>
      <span className="text-gray-500 dark:text-gray-400 mr-2">{name}:</span>
      <span className="text-base-content">{displayTxResult(value, size)}</span>
    </div>
  );
};

ObjectFieldDisplay.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Handle BigInt
    PropTypes.oneOf([null, undefined]),
  ] as PropTypes.Validator<DisplayContent>[]).isRequired,
  size: PropTypes.oneOf(["sm", "base", "xs", "lg", "xl", "2xl", "3xl"] as const).isRequired,
  leftPad: PropTypes.bool,
};

const ArrayDisplay: React.FC<{ values: DisplayContent[]; size: ResultFontSize }> = ({ values, size }): JSX.Element => {
  return (
    <div className="flex flex-col gap-y-1">
      {values.length ? "array" : "[]"}
      {values.map((v, i) => (
        <ObjectFieldDisplay key={i} name={`[${i}]`} value={v} size={size} />
      ))}
    </div>
  );
};

ArrayDisplay.propTypes = {
  values: PropTypes.arrayOf(PropTypes.any).isRequired,
  size: PropTypes.oneOf<ResultFontSize>(["sm", "base", "xs", "lg", "xl", "2xl", "3xl"]).isRequired,
};

const StructDisplay: React.FC<{ struct: Record<string, unknown>; size: ResultFontSize }> = ({ struct, size }): JSX.Element => {
  return (
    <div className="flex flex-col gap-y-1">
      struct
      {Object.entries(struct).map(([k, v]) => (
        <ObjectFieldDisplay key={k} name={k} value={v as DisplayContent} size={size} />
      ))}
    </div>
  );
};

StructDisplay.propTypes = {
  struct: PropTypes.objectOf(PropTypes.any).isRequired,
  size: PropTypes.oneOf(["sm", "base", "xs", "lg", "xl", "2xl", "3xl"] as const).isRequired,
};
