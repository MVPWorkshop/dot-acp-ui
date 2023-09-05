import React, { useState } from "react";
import { t } from "i18next";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { ReactComponent as BackArrow } from "../../../assets/img/back-arrow.svg";
import TokenAmountInput from "../../molecule/TokenAmountInput";
import Button from "../../atom/Button";
import { ButtonVariants } from "../../../global/enum";

type TokenProps = {
  tokenName: string;
  tokenIcon: React.ReactNode;
  tokenValue: number;
};

const tokenA = {
  tokenName: "DOT",
  tokenIcon: <DotToken />,
  tokenValue: 1,
};

const tokenB = {
  tokenName: "DOT",
  tokenIcon: <DotToken />,
  tokenValue: 2,
};

const SwapTokens = () => {
  const [selectedTokenA, setSelectedTokenA] = useState<TokenProps>(tokenA);
  const [selectedTokenB, setSelectedTokenB] = useState<TokenProps>(tokenB);
  const [slippageAuto, setSlippageAuto] = useState<boolean>(true);

  const slippageExists = true;
  const poolExists = true;

  const setSelectedTokenAValue = (value: number) => {
    if (selectedTokenA) {
      setSelectedTokenA({ ...selectedTokenA, tokenValue: value });
    }
  };

  const setSelectedTokenBValue = (value: number) => {
    if (selectedTokenB) {
      setSelectedTokenB({ ...selectedTokenB, tokenValue: value });
    }
  };

  const returnSwapButtonText = () => {
    if ((selectedTokenA && selectedTokenA?.tokenValue <= 0) || (selectedTokenB && selectedTokenB?.tokenValue <= 0)) {
      return t("button.enterAmount");
    }
    if (!selectedTokenA || !selectedTokenB) {
      return t("button.selectToken");
    }
    if (selectedTokenA && selectedTokenB && selectedTokenA?.tokenValue > selectedTokenB?.tokenValue) {
      return t("button.insufficientTokenAmount", { token: "DAI" });
    }
    if (selectedTokenA && selectedTokenB && selectedTokenA?.tokenValue <= selectedTokenB?.tokenValue) {
      return t("button.swap");
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-1.5 rounded-2xl bg-white p-5">
      <div className="absolute left-[18px] top-[18px]">
        <BackArrow width={24} height={24} />
      </div>
      <h3 className="heading-6 font-unbounded-variable font-normal">{t("swapPage.addLiquidity")}</h3>
      <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-b-modal-header-border-color" />
      <TokenAmountInput
        tokenText="DOT"
        labelText={t("tokenAmountInput.youPay")}
        tokenIcon={selectedTokenA?.tokenIcon}
        tokenValue={selectedTokenA?.tokenValue}
        onClick={() => console.log("open modal")}
        onSetTokenValue={(value) => setSelectedTokenAValue(value)}
      />
      <TokenAmountInput
        tokenText="DOT"
        labelText={t("tokenAmountInput.youReceive")}
        tokenIcon={selectedTokenB?.tokenIcon}
        tokenValue={selectedTokenB?.tokenValue}
        onClick={() => console.log("open modal")}
        onSetTokenValue={(value) => setSelectedTokenBValue(value)}
      />

      {slippageExists || poolExists ? (
        <div className="flex w-full flex-col gap-2 rounded-lg bg-purple-50 px-4 py-6">
          {slippageExists ? (
            <>
              <div className="flex w-full flex-row justify-between text-medium font-normal text-text-color-label-light">
                <div className="flex">{t("tokenAmountInput.slippageTolerance")}</div>
                <span>1%</span>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex w-full basis-8/12 flex-row rounded-xl bg-white p-1 text-large font-normal text-text-color-header-light">
                  <button
                    className={`flex basis-1/2 justify-center rounded-lg  px-4 py-3 ${
                      slippageAuto ? "bg-purple-100" : "bg-white"
                    }`}
                    onClick={() => setSlippageAuto(true)}
                  >
                    {t("tokenAmountInput.auto")}
                  </button>
                  <button
                    className={`flex basis-1/2 justify-center rounded-lg px-4 py-3 ${
                      slippageAuto ? "bg-white" : "bg-purple-100"
                    }`}
                    onClick={() => setSlippageAuto(false)}
                  >
                    {t("tokenAmountInput.custom")}
                  </button>
                </div>
                <div className="flex basis-1/3 justify-between rounded-lg bg-purple-100 p-4 text-large font-normal text-text-color-label-light">
                  1.00<span>%</span>
                </div>
              </div>
            </>
          ) : null}

          {poolExists ? (
            <div className="flex rounded-lg bg-lime-500 px-4 py-2 text-medium font-normal text-cyan-700">
              {t("swapPage.poolExists")}
            </div>
          ) : null}
        </div>
      ) : null}

      <Button
        onClick={() => console.log("click")}
        variant={ButtonVariants.btnInteractivePink}
        disabled={returnSwapButtonText() !== "Swap"}
      >
        {returnSwapButtonText()}
      </Button>
    </div>
  );
};

export default SwapTokens;
