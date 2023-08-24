import React from "react";
import { NumericFormat } from "react-number-format";
import Button from "../../atom/Button";

type TokenAmountInputProps = {
  tokenText: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  tokenIcon?: React.ReactNode;
  isFocused?: boolean;
  tokenValue?: number;
  onSetIsFocused: (focus: boolean) => void;
  onSetTokenValue: (value: number) => void;
  ref: React.RefObject<HTMLDivElement>;
};

const TokenAmountInput = React.forwardRef(function TokenAmountInput(
  {
    tokenIcon,
    tokenText,
    disabled,
    isFocused,
    tokenValue,
    onSetTokenValue,
    onSetIsFocused,
    onClick,
  }: TokenAmountInputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={`relative flex h-[103px] w-[424px] items-center justify-start gap-2 rounded-[8px] bg-[#F3F5FB] px-4 py-6 ${
        isFocused ? "border border-solid border-[#E6007A]" : null
      }`}
    >
      <label htmlFor="token-amount" className="absolute top-4 text-[11px] font-normal text-[#797a7e]">
        You pay
      </label>
      <NumericFormat
        id="token-amount"
        allowNegative={false}
        fixedDecimalScale
        displayType={"input"}
        placeholder={"0"}
        className="w-full basis-auto bg-transparent font-inter text-[28px] font-bold text-black outline-none"
        onFocus={() => onSetIsFocused(true)}
        value={tokenValue}
        onValueChange={(values) => {
          const { floatValue } = values;
          onSetTokenValue(floatValue || 0);
        }}
      />

      {tokenIcon && tokenText ? (
        <Button
          icon={tokenIcon}
          type="button"
          onClick={() => onClick()}
          variant="secondary-select"
          disabled={disabled}
          className="basis-2/5 disabled:basis-[23%]"
        >
          {tokenText}
        </Button>
      ) : (
        <Button type="button" onClick={() => console.log("click")} variant="primary-select" className="basis-[57%]">
          Select token
        </Button>
      )}
    </div>
  );
});

export default TokenAmountInput;
