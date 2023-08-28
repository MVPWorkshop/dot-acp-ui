import { ReactNode, useState } from "react";
import { ReactComponent as ArrowDownIcon } from "../../../assets/img/down-arrow.svg";
import { ButtonText, ButtonVariants } from "../../../global/enum";
import classNames from "classnames";
import "./style.scss";

type ButtonProps = {
  children?: ReactNode;
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
  onClick: () => void;
};

const Button = ({ children, disabled, className, icon, variant, size, onClick }: ButtonProps) => {
  const [isButtonHover, setIsButtonHover] = useState(false);

  const showIcon = () => {
    return variant === ButtonVariants.btnPrimary || variant === ButtonVariants.btnSecondarySelect;
  };

  const getIcon = () => {
    if (variant === ButtonVariants.btnPrimarySelect) {
      return <ArrowDownIcon width={16} height={16} color="white" />;
    }

    if (variant === ButtonVariants.btnSecondarySelect) {
      return <ArrowDownIcon width={16} height={16} color={`${isButtonHover && !disabled ? "white" : "black"}`} />;
    }

    return null;
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
      {getIcon()}
    </button>
  );
};

export default Button;
