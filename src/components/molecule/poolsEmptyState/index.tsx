import { ReactComponent as TokenIcon } from "../../../assets/img/token-icon.svg";

const PollsEmptyState = () => {
  return (
    <div className="flex h-[664px] flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6">
      <TokenIcon />
      <div className="text-center tracking-[.2px] text-text-color-body-light">
        Active liquidity positions will appear here.
      </div>
    </div>
  );
};

export default PollsEmptyState;
