import classNames from "classnames";
import React, { useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import Button from "../../atom/Button";
import { ButtonVariants } from "../../../app/types/enum";
import { t } from "i18next";
import useClickOutside from "../../../app/hooks/useClickOutside";

type TokenAmountInputProps = {
  tokenText: string;
  disabled?: boolean;
  className?: string;
  tokenIcon?: React.ReactNode;
  tokenValue?: number | null;
  labelText?: string;
  onClick: () => void;
  onSetTokenValue: (value: number) => void;
};

const TokenAmountInput = ({
  tokenIcon,
  tokenText,
  disabled,
  tokenValue,
  labelText,
  onSetTokenValue,
  onClick,
}: TokenAmountInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useClickOutside(wrapperRef, () => {
    setIsFocused(false);
  });

  return (
    <div
      ref={wrapperRef}
      className={classNames(
        "relative flex items-center justify-start gap-2 rounded-lg border bg-purple-100 px-4 py-7",
        {
          "border-pink": isFocused,
          "border-transparent": !isFocused,
        }
      )}
    >
      <label htmlFor="token-amount" className="absolute top-4 text-small font-normal text-text-color-label-light">
        {labelText}
      </label>
      <NumericFormat
        id="token-amount"
        getInputRef={inputRef}
        allowNegative={false}
        fixedDecimalScale
        displayType={"input"}
        disabled={disabled}
        placeholder={"0"}
        className="w-full basis-auto bg-transparent font-unbounded-variable text-heading-4 font-bold text-text-color-body-light outline-none"
        onFocus={() => setIsFocused(true)}
        value={tokenValue}
        onValueChange={({ floatValue }) => {
          onSetTokenValue(floatValue || 0);
        }}
      />

      {tokenText ? (
        <Button
          icon={tokenIcon}
          type="button"
          onClick={() => onClick()}
          variant={ButtonVariants.btnSelectGray}
          disabled={disabled}
          className="basis-2/5 disabled:basis-[23%]"
        >
          {tokenText}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => onClick()}
          variant={ButtonVariants.btnSelectPink}
          className="basis-[57%]"
          disabled={disabled}
        >
          {t("button.selectToken")}
        </Button>
      )}
    </div>
  );
};

export default TokenAmountInput;
