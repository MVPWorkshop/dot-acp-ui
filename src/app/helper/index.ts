import { useEffect } from "react";

type OutsideAlerterProps = {
  wrapperRef: React.RefObject<HTMLDivElement>;
  onSetIsFocused: (focus: boolean) => void;
};

export const useOutsideAlerter = ({ wrapperRef, onSetIsFocused }: OutsideAlerterProps) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onSetIsFocused(false);
      }
    }
    document.addEventListener("mousedown", (event) => handleClickOutside(event));
    return () => {
      document.removeEventListener("mousedown", (event) => handleClickOutside(event));
    };
  }, [wrapperRef]);
};
