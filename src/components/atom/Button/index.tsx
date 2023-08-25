import { ReactNode, useState } from "react";
import { ReactComponent as DownArrowBlack } from "../../../assets/img/downArrowBlack.svg";
import { ReactComponent as DownArrowWhite } from "../../../assets/img/downArrowWhite.svg";
import classNames from "classnames";
import "./style.scss";
import { ButtonText, ButtonVariants } from "../../../global/enum";

type ButtonProps = {
  children?: ReactNode;
  onClick: () => void;
  type?: HTMLButtonElement["type"];
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  variant?:
    | ButtonVariants.btnPrimary
    | ButtonVariants.btnSecondary
    | ButtonVariants.btnInteractive
    | ButtonVariants.btnPrimarySelect
    | ButtonVariants.btnSecondarySelect;
  size?: ButtonText.btnTextSmall | ButtonText.btnTextMedium;
};

const Button = ({ children, onClick, disabled, className, icon, variant, size }: ButtonProps) => {
  const [isButtonHover, setIsButtonHover] = useState(false);

  const showIcon = () => {
    return variant === ButtonVariants.btnPrimary || variant === ButtonVariants.btnSecondarySelect;
  };

  return (
    <button
      className={classNames(`btn ${className || ""}`, {
        "btn-primary": variant === undefined || variant === ButtonVariants.btnPrimary,
        "btn-secondary": variant === ButtonVariants.btnSecondary,
        "btn-interactive": variant === ButtonVariants.btnInteractive,
        "btn-primary-select": variant === ButtonVariants.btnPrimarySelect,
        "btn-secondary-select": variant === ButtonVariants.btnSecondarySelect,
        "btn-disabled": variant === ButtonVariants.btnSecondarySelect && disabled,
        "btn-interactive-disabled": variant === ButtonVariants.btnInteractive && disabled,
        "text-small": size === ButtonText.btnTextSmall,
        "text-medium": size === ButtonText.btnTextMedium,
      })}
      onClick={() => (!disabled ? onClick() : null)}
      disabled={disabled}
      onMouseEnter={() => setIsButtonHover(true)}
      onMouseLeave={() => setIsButtonHover(false)}
      type="button"
    >
      {icon && showIcon() ? icon : null}
      {children}
      {isButtonHover && !disabled && variant === ButtonVariants.btnPrimarySelect ? (
        <DownArrowWhite width={16} height={16} />
      ) : null}
      {!isButtonHover && !disabled && variant === ButtonVariants.btnPrimarySelect ? (
        <DownArrowWhite width={16} height={16} />
      ) : null}

      {isButtonHover && !disabled && variant === ButtonVariants.btnSecondarySelect ? (
        <DownArrowWhite width={16} height={16} />
      ) : null}
      {!isButtonHover && !disabled && variant === ButtonVariants.btnSecondarySelect ? (
        <DownArrowBlack width={16} height={16} />
      ) : null}
    </button>
  );
};

export default Button;
