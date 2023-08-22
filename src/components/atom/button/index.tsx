type ButtonProps = {
  text: string;
  onClick: () => void;
  type: HTMLButtonElement["type"];
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  variant: "primary" | "secondary" | "interactive";
  size?: "small" | "large";
};

const Button = ({ text, onClick, disabled, className, icon, variant, size, type = "button", ...rest }: ButtonProps) => {
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
            border border-solid border-black bg-white px-6 py-4 text-[11px] text-base
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
    }
  };
  return renderButtonVariant(variant);
};

export default Button;
