import { ReactNode, useState } from "react";
import { ReactComponent as DownArrowBlack } from "../../../assets/img/downArrowBlack.svg";
import { ReactComponent as DownArrowWhite } from "../../../assets/img/downArrowWhite.svg";
import classNames from "classnames";
import "./style.scss";

type ButtonProps = {
  children?: ReactNode;
  onClick: () => void;
  type?: HTMLButtonElement["type"];
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "interactive" | "primary-select" | "secondary-select";
  size?: "small" | "large";
};

const Button = ({ children, onClick, disabled, className, icon, variant, size }: ButtonProps) => {
  const [isButtonHover, setIsButtonHover] = useState(false);

  const showIcon = () => {
    return variant === "primary" || variant === "secondary-select";
  };

  return (
    <button
      className={classNames(`btn ${className || ""}`, {
        "btn-primary": variant === undefined || variant === "primary",
        "btn-secondary": variant === "secondary",
        "btn-interactive": variant === "interactive",
        "btn-primary-select": variant === "primary-select",
        "btn-secondary-select": variant === "secondary-select",
        "btn-disabled": variant === "secondary-select" && disabled,
        "btn-interactive-disabled": variant === "interactive" && disabled,
        "text-small": size === "small",
        "text-medium": size === "large",
      })}
      onClick={() => (!disabled ? onClick() : null)}
      disabled={disabled}
      onMouseEnter={() => setIsButtonHover(true)}
      onMouseLeave={() => setIsButtonHover(false)}
      type="button"
    >
      {icon && showIcon() ? icon : null}
      {children}
      {isButtonHover && !disabled && variant === "primary-select" ? <DownArrowWhite width={16} height={16} /> : null}
      {!isButtonHover && !disabled && variant === "primary-select" ? <DownArrowWhite width={16} height={16} /> : null}

      {isButtonHover && !disabled && variant === "secondary-select" ? <DownArrowWhite width={16} height={16} /> : null}
      {!isButtonHover && !disabled && variant === "secondary-select" ? <DownArrowBlack width={16} height={16} /> : null}
    </button>
  );
};

export default Button;
