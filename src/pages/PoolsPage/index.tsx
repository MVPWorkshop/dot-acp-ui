import Button from "../../components/atom/Button";
import PoolsEmptyState from "../../components/molecule/poolsEmptyState";
import PoolTable from "./PoolTable";
import { ButtonText, ButtonVariants } from "../../global/enum";

const PoolsPage = () => {
  return (
    <div className="flex items-center justify-center px-28">
      <div className="flex w-full max-w-[1280px] flex-col">
        <div className="flex items-center justify-between px-6 py-8">
          <div className="flex flex-col  gap-[4px] leading-[120%]">
            <div className="font-unbounded-variable text-heading-5 font-[700] tracking-[.046px] text-text-color-header-light">
              Pools
            </div>
            <div className="tracking-[.2px] text-text-color-body-light">Earn fees by providing liquidity.</div>
          </div>
          <div>
            <Button
              onClick={() => console.log("create poll")}
              variant={ButtonVariants.btnPrimary}
              size={ButtonText.btnTextMedium}
            >
              New Position
            </Button>
          </div>
        </div>
        <PoolsEmptyState />
        <PoolTable />
      </div>
    </div>
  );
};
export default PoolsPage;
