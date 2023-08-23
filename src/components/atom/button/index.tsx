import { useState } from "react";
import { ReactComponent as DownArrowBlack } from "../../../assets/img/downArrowBlack.svg";
import { ReactComponent as DownArrowWhite } from "../../../assets/img/downArrowWhite.svg";

type ButtonProps = {
  text?: string;
  onClick: () => void;
  type: HTMLButtonElement["type"];
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  variant: "primary" | "secondary" | "interactive" | "primary-select" | "secondary-select";
  size?: "small" | "large";
};

const Button = ({ text, onClick, disabled, className, icon, variant, size, type = "button", ...rest }: ButtonProps) => {
  const [isButtonHover, setIsButtonHover] = useState(false);
  const getButtonSizeStyle = () => {
    switch (size) {
      case "small":
        return "h-[38px] w-[110px] text-[11px]";
      case "large":
        return "h-[48px] w-[152px] text-[13px]";
    }
  };
  const renderButtonVariant = (buttonVariant: string) => {
    switch (buttonVariant) {
      case "primary":
        return (
          <button
            className={`${getButtonSizeStyle()} flex items-center justify-center 
            gap-2 rounded-[100px] bg-[#e6007a] px-6 py-4 font-normal text-white
            hover:bg-black ${className ? className : null}`}
            onClick={() => (!disabled ? onClick() : null)}
            disabled={disabled}
            type={type}
            {...rest}
          >
            {icon ? icon : null}
            {text}
          </button>
        );
      case "secondary":
        return (
          <button
            className={`flex h-[38px] w-[165px] items-center justify-center rounded-[100px] 
            border border-solid border-black bg-white px-6 py-4 text-[11px]
            font-normal text-black hover:border-0 hover:bg-[#e6007a] hover:text-white ${className ? className : null}`}
            onClick={() => (!disabled ? onClick() : null)}
            disabled={disabled}
            type={type}
            {...rest}
          >
            {text}
          </button>
        );
      case "interactive":
        return (
          <button
            className={`flex h-[51px] w-[424px] items-center justify-center 
            gap-2 rounded-lg px-6 py-4 font-normal 
            hover:bg-black ${className ? className : null} ${
              !disabled ? "bg-[#e6007a] text-white" : "bg-[#a6a6a6] text-[#686868] hover:bg-[#a6a6a6]"
            }`}
            onClick={() => (!disabled ? onClick() : null)}
            disabled={disabled}
            type={type}
            {...rest}
          >
            {text}
          </button>
        );
      case "primary-select":
        return (
          <button
            className={`flex h-[31px] w-[145px] items-center justify-center gap-2
              rounded-[100px] bg-[#e6007a] px-3 py-[6px] text-[16px] font-normal text-white
              hover:bg-black ${className ? className : null}`}
            onClick={() => (!disabled ? onClick() : null)}
            disabled={disabled}
            type={"button"}
            {...rest}
          >
            Select token
            <DownArrowWhite />
          </button>
        );
      case "secondary-select":
        return (
          <button
            className={`flex max-h-[36px] max-w-[145px] items-center justify-center
              gap-2 rounded-[100px] px-6 py-4 font-normal ${className ? className : null}
              ${!disabled ? "bg-[#E6EAF6] text-black hover:bg-black hover:text-white " : "bg-[#a6a6a6] text-black"}`}
            onClick={() => (!disabled ? onClick() : null)}
            disabled={disabled}
            onMouseEnter={() => setIsButtonHover(true)}
            onMouseLeave={() => setIsButtonHover(false)}
            type={"button"}
            {...rest}
          >
            {icon ? icon : null}
            {text}
            {isButtonHover && !disabled ? <DownArrowWhite /> : null}
            {!isButtonHover && !disabled ? <DownArrowBlack /> : null}
          </button>
        );
    }
  };
  return renderButtonVariant(variant);
};

export default Button;
