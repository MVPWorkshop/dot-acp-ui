import { useRef, useState } from "react";
import { ReactComponent as DotToken } from "../../assets/img/dotToken.svg";
import { ReactComponent as AddToken } from "../../assets/img/addIcon.svg";
import Button from "../../components/atom/Button";
import TokenAmountInput from "../../components/molecule/TokenAmountInput";
import { useOutsideAlerter } from "../../app/helper";
import { ButtonText, ButtonVariants } from "../../global/enum";

const HomePage = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [tokenValue, setTokenValue] = useState<number>();

  const onSetTokenValue = (value: number) => {
    setTokenValue(value);
  };

  const onSetIsFocused = (focus: boolean) => {
    setIsFocused(focus);
  };
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter({ wrapperRef, onSetIsFocused });
  return (
    <div>
      <Button onClick={() => console.log("click")} variant={ButtonVariants.btnPrimary} size={ButtonText.btnTextMedium}>
        New Position
      </Button>
      <br />
      <Button
        onClick={() => console.log("click")}
        variant={ButtonVariants.btnPrimary}
        size={ButtonText.btnTextSmall}
        icon={<AddToken />}
      >
        Deposit
      </Button>
      <br />
      <Button onClick={() => console.log("click")} variant={ButtonVariants.btnInteractive}>
        Enter button text
      </Button>
      <br />
      <Button type="button" onClick={() => console.log("click")} variant={ButtonVariants.btnInteractive} disabled>
        Enter button text
      </Button>
      <br />
      <Button onClick={() => console.log("click")} variant={ButtonVariants.btnSecondary}>
        Enter button text
      </Button>
      <br />
      <Button onClick={() => console.log("click")} variant={ButtonVariants.btnPrimarySelect}>
        Select token
      </Button>
      <br />
      <Button
        type="button"
        onClick={() => console.log("click")}
        variant={ButtonVariants.btnSecondarySelect}
        icon={<DotToken />}
      >
        DOT
      </Button>
      <br />
      <Button
        type="button"
        onClick={() => console.log("click")}
        variant={ButtonVariants.btnSecondarySelect}
        icon={<DotToken />}
        disabled
      >
        DOT
      </Button>
      <br />
      <TokenAmountInput
        ref={wrapperRef}
        tokenText="DOT"
        tokenIcon={<DotToken />}
        tokenValue={tokenValue}
        disabled={true}
        onClick={() => console.log("open modal")}
        onSetIsFocused={onSetIsFocused}
        onSetTokenValue={onSetTokenValue}
        isFocused={isFocused}
      />
      <br />
      <TokenAmountInput
        ref={wrapperRef}
        tokenText="DOT"
        tokenIcon={<DotToken />}
        tokenValue={tokenValue}
        onClick={() => console.log("open modal")}
        onSetIsFocused={onSetIsFocused}
        onSetTokenValue={onSetTokenValue}
        isFocused={isFocused}
      />
      <br />
      <TokenAmountInput
        ref={wrapperRef}
        tokenText="DOT"
        onClick={() => console.log("open modal")}
        onSetIsFocused={onSetIsFocused}
        onSetTokenValue={onSetTokenValue}
        isFocused={isFocused}
      />
    </div>
  );
};
export default HomePage;
