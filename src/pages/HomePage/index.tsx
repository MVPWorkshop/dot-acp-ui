import { useRef, useState } from "react";
import { ReactComponent as DotToken } from "../../assets/img/dotToken.svg";
import { ReactComponent as AddToken } from "../../assets/img/addIcon.svg";
import Button from "../../components/atom/Button";
import TokenAmountInput from "../../components/molecule/tokenAmountInput";
import { useOutsideAlerter } from "../../app/helper";

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
      <Button onClick={() => console.log("click")} variant="primary" size="large">
        New Position
      </Button>
      <br />
      <Button onClick={() => console.log("click")} variant="primary" size="small" icon={<AddToken />}>
        Deposit
      </Button>
      <br />
      <Button onClick={() => console.log("click")} variant="interactive">
        Enter button text
      </Button>
      <br />
      <Button type="button" onClick={() => console.log("click")} variant="interactive" disabled>
        Enter button text
      </Button>
      <br />
      <Button onClick={() => console.log("click")} variant="secondary">
        Enter button text
      </Button>
      <br />
      <Button onClick={() => console.log("click")} variant="primary-select">
        Select token
      </Button>
      <br />
      <Button type="button" onClick={() => console.log("click")} variant="secondary-select" icon={<DotToken />}>
        DOT
      </Button>
      <br />
      <Button
        type="button"
        onClick={() => console.log("click")}
        variant="secondary-select"
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
