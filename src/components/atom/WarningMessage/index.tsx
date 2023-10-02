import { ReactComponent as WarningIcon } from "../../../assets/img/warning-icon.svg";

type WarningMessageProps = {
  message: string;
  show: boolean;
};

const WarningMessage = ({ message, show }: WarningMessageProps) => {
  return show ? (
    <div className="flex gap-5 rounded-2xl bg-yellow-100 p-6 font-inter text-sm font-normal">
      <span className="mt-0.5">
        <WarningIcon />
      </span>
      {message}
    </div>
  ) : null;
};

export default WarningMessage;
