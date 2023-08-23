import React from "react";
import Button from "../../atom/Button";

type TokenAmountInputProps = {
  tokenText: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  tokenIcon?: React.ReactNode;
  isFocused?: boolean;
  onSetIsFocused: (focus: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: any;
};

const TokenAmountInput = ({
  tokenIcon,
  tokenText,
  disabled,
  isFocused,
  ref,
  onSetIsFocused,
  onClick,
}: TokenAmountInputProps) => {
  return (
    <div
      ref={ref}
      className={`relative flex h-[103px] w-[424px] items-center justify-start rounded-[8px] bg-[#F3F5FB] px-4 py-6 ${
        isFocused ? "border border-solid border-[#E6007A]" : null
      }`}
    >
      <label htmlFor="token-amount" className="absolute top-4 text-[11px] font-normal text-[#797a7e]">
        You pay
      </label>
      <input
        type="number"
        id="token-amount"
        placeholder={"0"}
        className="w-[247px] bg-transparent text-[28px] font-bold text-black"
        onFocus={() => onSetIsFocused(true)}
      />

      {tokenIcon && tokenText ? (
        <Button icon={tokenIcon} type="button" onClick={() => onClick()} variant="secondary-select" disabled={disabled}>
          {tokenText}
        </Button>
      ) : (
        <Button type="button" onClick={() => console.log("click")} variant="primary-select">
          Select token
        </Button>
      )}
    </div>
  );
};

export default TokenAmountInput;
