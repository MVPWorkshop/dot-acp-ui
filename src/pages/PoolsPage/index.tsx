import Button from "../../components/atom/Button";
import PoolsEmptyState from "../../components/molecule/poolsEmptyState";
import PoolTable from "./PoolTable";
import { useAppContext } from "../../stateProvider";
import { ButtonText, ButtonVariants } from "../../global/enum";
import { createPool } from "../../services/poolsServices";
import dotAcpToast from "../../helper/toast";

const PoolsPage = () => {
  const { state } = useAppContext();
  const { api, selectedAccount, pools } = state;

  const handleCreatePool = async () => {
    try {
      if (api) {
        await createPool(api, "47", selectedAccount, "1000000000000", "2000000000000", "1000000000000", "2");
      }
    } catch (error) {
      dotAcpToast.error(`Error: ${error}`);
    }
  };

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
            <Button onClick={handleCreatePool} variant={ButtonVariants.btnPrimary} size={ButtonText.btnTextMedium}>
              New Position
            </Button>
          </div>
        </div>
        {!pools ? <PoolsEmptyState /> : <PoolTable />}
      </div>
    </div>
  );
};
export default PoolsPage;
