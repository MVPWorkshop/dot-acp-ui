import { useState } from "react";
import { ReactComponent as DotToken } from "../../assets/img/dot-token.svg";
import { ReactComponent as AddIcon } from "../../assets/img/add-icon.svg";
import Button from "../../components/atom/Button";
import TokenAmountInput from "../../components/molecule/TokenAmountInput";
import { ButtonVariants } from "../../global/enum";

const HomePage = () => {
  const [tokenValue, setTokenValue] = useState<number>();

  const onSetTokenValue = (value: number) => {
    setTokenValue(value);
  };

  return (
    <div className="flex flex-col items-center bg-white pb-10">
      <div className="mt-8 w-[152px]">
        <Button onClick={() => console.log("click")} variant={ButtonVariants.btnPrimaryPinkLg}>
          New Position
        </Button>
        <br />
        <Button onClick={() => console.log("click")} variant={ButtonVariants.btnPrimaryGhostLg}>
          New Position
        </Button>
      </div>
      <br />
      <div className="mt-8 w-[110px]">
        <Button onClick={() => console.log("click")} variant={ButtonVariants.btnPrimaryPinkSm}>
          Deposit
        </Button>
        <br />
        <Button onClick={() => console.log("click")} variant={ButtonVariants.btnPrimaryGhostSm}>
          Deposit
        </Button>
        <br />
        <Button onClick={() => console.log("click")} variant={ButtonVariants.btnPrimaryPinkSm} icon={<AddIcon />}>
          Deposit
        </Button>
      </div>
      <br />
      <div className="mt-8 w-[424px]">
        <Button onClick={() => console.log("click")} variant={ButtonVariants.btnInteractivePink}>
          Enter button text
        </Button>
        <br />
        <Button type="button" onClick={() => console.log("click")} variant={ButtonVariants.btnInteractiveGhost}>
          Enter button text
        </Button>
        <br />
        <Button
          type="button"
          onClick={() => console.log("click")}
          variant={ButtonVariants.btnInteractiveDisabled}
          disabled={true}
        >
          Enter button text
        </Button>
      </div>
      <br />
      <div className="mt-8 w-[165px]">
        <Button onClick={() => console.log("click")} variant={ButtonVariants.btnSecondaryWhite}>
          Enter button text
        </Button>
        <br />
        <Button onClick={() => console.log("click")} variant={ButtonVariants.btnSecondaryGray}>
          Enter button text
        </Button>
      </div>
      <br />
      <div className="mt-8 w-[145px]">
        <Button onClick={() => console.log("click")} variant={ButtonVariants.btnSelectPink}>
          Select token
        </Button>
      </div>
      <br />
      <div className="w-[114px]">
        <Button
          type="button"
          onClick={() => console.log("click")}
          variant={ButtonVariants.btnSelectGray}
          icon={<DotToken />}
        >
          DOT
        </Button>
      </div>
      <br />
      <div className="w-[90px]">
        <Button
          type="button"
          onClick={() => console.log("click")}
          variant={ButtonVariants.btnSelectDisabled}
          icon={<DotToken />}
          disabled
        >
          DOT
        </Button>
      </div>
      <br />
      <div className="mt-8 w-[424px]">
        <TokenAmountInput
          tokenText="DOT"
          tokenIcon={<DotToken />}
          tokenValue={tokenValue}
          disabled={true}
          onClick={() => console.log("open modal")}
          onSetTokenValue={onSetTokenValue}
        />
        <br />
        <TokenAmountInput
          tokenText="DOT"
          tokenIcon={<DotToken />}
          tokenValue={tokenValue}
          onClick={() => console.log("open modal")}
          onSetTokenValue={onSetTokenValue}
        />
        <br />
        <TokenAmountInput tokenText="DOT" onClick={() => console.log("open modal")} onSetTokenValue={onSetTokenValue} />
      </div>
    </div>
  );
};
export default HomePage;
