import { ReactComponent as AddIcon } from "../../../assets/img/addIcon.svg";
import "./styles.scss";

type ButtonProps = {
  text: string;
  hasAddIcon?: boolean;
  onClick: () => void;
  type: HTMLButtonElement["type"];
  disabled?: boolean;
  styles: string;
};

const Button = ({ text, hasAddIcon, onClick, type, disabled, styles, ...rest }: ButtonProps) => {
  return (
    <button className={styles} onClick={onClick} disabled={disabled} type={type} {...rest}>
      {hasAddIcon && <AddIcon />}
      {text}
    </button>
  );
};

export default Button;
