import { ReactComponent as DotToken } from "../../assets/img/dotToken.svg";
import { ReactComponent as AddToken } from "../../assets/img/addIcon.svg";
import Button from "../../components/atom/Button";
import TokenAmountInput from "../../components/molecule/tokenAmountInput";
import { useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useOutsideAlerter(ref: any, onSetIsFocused: any) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onSetIsFocused(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

const HomePage = () => {
  const [isFocused, setIsFocused] = useState(false);

  const onSetIsFocused = (focus: boolean) => {
    setIsFocused(focus);
  };
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, onSetIsFocused);
  return (
    <h1>
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
        onClick={() => console.log("open modal")}
        onSetIsFocused={onSetIsFocused}
        isFocused={isFocused}
      />
    </h1>
  );
};
export default HomePage;
