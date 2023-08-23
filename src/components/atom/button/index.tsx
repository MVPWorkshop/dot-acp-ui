import { useState } from "react";
import { ReactComponent as DownArrowBlack } from "../../../assets/img/downArrowBlack.svg";
import { ReactComponent as DownArrowWhite } from "../../../assets/img/downArrowWhite.svg";
import classNames from "classnames";
import "./styles.scss";

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

  const showIcon = () => {
    return variant === "primary" || variant === "secondary-select";
  };

  return (
    <button
      className={classNames(className, {
        "btn-primary": variant === "primary",
        "btn-secondary": variant === "secondary",
        "btn-interactive": variant === "interactive",
        "btn-primary-select": variant === "primary-select",
        "btn-secondary-select": variant === "secondary-select",
        "text-small": size === "small",
        "text-medium": size === "large",
        "btn-disabled": variant === "secondary-select" && disabled,
        "btn-interactive-disabled": variant === "interactive" && disabled,
      })}
      onClick={() => (!disabled ? onClick() : null)}
      disabled={disabled}
      onMouseEnter={() => setIsButtonHover(true)}
      onMouseLeave={() => setIsButtonHover(false)}
      type={type}
      {...rest}
    >
      {icon && showIcon() ? icon : null}
      {text}
      {isButtonHover && !disabled && variant === "primary-select" ? <DownArrowWhite /> : null}
      {!isButtonHover && !disabled && variant === "primary-select" ? <DownArrowWhite /> : null}

      {isButtonHover && !disabled && variant === "secondary-select" ? <DownArrowWhite /> : null}
      {!isButtonHover && !disabled && variant === "secondary-select" ? <DownArrowBlack /> : null}
    </button>
  );
};

export default Button;
