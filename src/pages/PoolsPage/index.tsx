import { useNavigate } from "react-router-dom";
import { POOLS_ADD_LIQUIDITY } from "../../app/router/routes";
import Button from "../../components/atom/Button";
import PoolsEmptyState from "../../components/molecule/poolsEmptyState";
import { ButtonText, ButtonVariants } from "../../global/enum";
import { useAppContext } from "../../stateProvider";
import PoolTable from "./PoolTable";

const PoolsPage = () => {
  const { state } = useAppContext();
  const { pools, selectedAccount, tokenBalances } = state;
  const navigate = useNavigate();

  const navigateToAddLiquidity = () => {
    navigate(POOLS_ADD_LIQUIDITY);
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
            <Button
              onClick={navigateToAddLiquidity}
              variant={ButtonVariants.btnPrimary}
              size={ButtonText.btnTextMedium}
              disabled={selectedAccount && tokenBalances ? false : true}
            >
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
