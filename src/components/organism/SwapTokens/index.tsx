import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { ReactComponent as BackArrow } from "../../../assets/img/back-arrow.svg";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { ButtonVariants } from "../../../global/enum";
import Button from "../../atom/Button";
import TokenAmountInput from "../../molecule/TokenAmountInput";
import SwapSelectTokenModal from "../SwapSelectTokenModal";

type TokenProps = {
  tokenSymbol: string;
  tokenId: string;
  decimals: string;
  tokenBalance: string;
};
type TokenValueProps = {
  tokenValue: number;
};

const SwapTokens = () => {
  const [isModalAOpen, setIsModalAOpen] = useState<boolean>(false);
  const [isModalBOpen, setIsModalBOpen] = useState<boolean>(false);
  const [selectedTokenA, setSelectedTokenA] = useState<TokenProps>({
    tokenSymbol: "",
    tokenId: "",
    decimals: "",
    tokenBalance: "",
  });
  const [selectedTokenB, setSelectedTokenB] = useState<TokenProps>({
    tokenSymbol: "",
    tokenId: "",
    decimals: "",
    tokenBalance: "",
  });
  const [selectedTokenAValue, setSelectedTokenAValue] = useState<TokenValueProps>({ tokenValue: 0 });
  const [selectedTokenBValue, setSelectedTokenBValue] = useState<TokenValueProps>({ tokenValue: 0 });
  const [slippageAuto, setSlippageAuto] = useState<boolean>(true);
  const [slippageValue, setSlippageValue] = useState<number | undefined>(15);

  const tokenAValue = (value: number) => {
    if (selectedTokenAValue) {
      setSelectedTokenAValue({ tokenValue: value });
    }
  };

  const tokenBValue = (value: number) => {
    if (selectedTokenBValue) {
      setSelectedTokenBValue({ tokenValue: value });
    }
  };

  const checkIfSwapIsPossible = () => {
    if (!selectedTokenA || !selectedTokenB) {
      return "Select Token";
    }
    if ((selectedTokenA && selectedTokenAValue?.tokenValue <= 0) || selectedTokenBValue?.tokenValue <= 0) {
      return "Enter Amount";
    }
    if (selectedTokenA && selectedTokenB && selectedTokenAValue?.tokenValue > selectedTokenBValue?.tokenValue) {
      return "Insufficient DAI amount";
    }
    if (selectedTokenA && selectedTokenB && selectedTokenAValue?.tokenValue <= selectedTokenBValue?.tokenValue) {
      return "Swap";
    }
  };

  const openModalA = () => {
    setIsModalAOpen(true);
  };
  const openModalB = () => {
    setIsModalBOpen(true);
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-1.5 rounded-2xl bg-white p-5">
      <div className="absolute left-[18px] top-[18px]">
        <BackArrow width={24} height={24} />
      </div>
      <h3 className="heading-6 font-unbounded-variable font-normal">Swap</h3>
      <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-b-modal-header-border-color" />
      <TokenAmountInput
        tokenText={selectedTokenA?.tokenSymbol}
        labelText="youPay"
        tokenIcon={<DotToken />}
        tokenValue={selectedTokenAValue?.tokenValue}
        onClick={openModalA}
        onSetTokenValue={(value) => tokenAValue(value)}
      />
      <TokenAmountInput
        tokenText={selectedTokenB?.tokenSymbol}
        labelText="You receive"
        tokenIcon={<DotToken />}
        tokenValue={selectedTokenBValue.tokenValue}
        onClick={openModalB}
        onSetTokenValue={(value) => tokenBValue(value)}
      />

      <div className="flex w-full flex-col gap-2 rounded-lg bg-purple-50 px-4 py-6">
        <>
          <div className="flex w-full flex-row justify-between text-medium font-normal text-text-color-label-light">
            <div className="flex">Slippage tolerance</div>
            <span>{slippageValue}%</span>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex w-full basis-8/12 flex-row rounded-xl bg-white p-1 text-large font-normal text-text-color-header-light">
              <button
                className={`flex basis-1/2 justify-center rounded-lg  px-4 py-3 ${
                  slippageAuto ? "bg-purple-100" : "bg-white"
                }`}
                onClick={() => {
                  setSlippageAuto(true);
                  setSlippageValue(15);
                }}
              >
                Auto
              </button>
              <button
                className={`flex basis-1/2 justify-center rounded-lg px-4 py-3 ${
                  slippageAuto ? "bg-white" : "bg-purple-100"
                }`}
                onClick={() => setSlippageAuto(false)}
              >
                Custom
              </button>
            </div>
            <div className="flex basis-1/3">
              <div className="relative flex">
                <NumericFormat
                  value={slippageValue}
                  onValueChange={({ floatValue }) => setSlippageValue(floatValue)}
                  fixedDecimalScale={true}
                  thousandSeparator={false}
                  allowNegative={false}
                  className="w-full rounded-lg bg-purple-100 p-2 text-large  text-text-color-label-light outline-none"
                  placeholder="15"
                  disabled={slippageAuto ? true : false}
                />
                <span className="absolute bottom-1/3 right-2 text-medium text-text-color-disabled-light">%</span>
              </div>
            </div>
          </div>
        </>
      </div>

      <SwapSelectTokenModal
        setSelectedToken={setSelectedTokenA}
        setIsModalOpen={setIsModalAOpen}
        selectedTokenA={selectedTokenA}
        selectedTokenB={selectedTokenB}
        isModalOpen={isModalAOpen}
        title="Select token"
      />
      <SwapSelectTokenModal
        setSelectedToken={setSelectedTokenB}
        setIsModalOpen={setIsModalBOpen}
        selectedTokenA={selectedTokenA}
        selectedTokenB={selectedTokenB}
        isModalOpen={isModalBOpen}
        title="Select token"
      />

      <Button
        onClick={() => console.log("click")}
        variant={ButtonVariants.btnInteractivePink}
        disabled={checkIfSwapIsPossible() !== "Swap"}
      >
        {checkIfSwapIsPossible()}
      </Button>
    </div>
  );
};

export default SwapTokens;
