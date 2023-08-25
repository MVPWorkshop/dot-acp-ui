import React from "react";
import { NumericFormat } from "react-number-format";
import Button from "../../atom/Button";
import { ButtonVariants } from "../../../global/enum";

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
      className={`relative flex items-center justify-start gap-2 rounded-[8px] bg-purple-100 px-4 py-7 ${
        isFocused ? "border border-solid border-pink" : null
      }`}
    >
      <label htmlFor="token-amount" className="absolute top-4 text-small font-normal text-text-color-label-light">
        You pay
      </label>
      <NumericFormat
        id="token-amount"
        allowNegative={false}
        fixedDecimalScale
        displayType={"input"}
        placeholder={"0"}
        className="w-full basis-auto bg-transparent text-heading-4 font-bold text-black outline-none"
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
          variant={ButtonVariants.btnSecondarySelect}
          disabled={disabled}
          className="basis-2/5 disabled:basis-[23%]"
        >
          {tokenText}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => console.log("click")}
          variant={ButtonVariants.btnPrimarySelect}
          className="basis-[57%]"
        >
          Select token
        </Button>
      )}
    </div>
  );
});

export default TokenAmountInput;
