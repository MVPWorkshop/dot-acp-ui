import Button from "../../components/atom/Button";
import { ButtonVariants } from "../../app/types/enum";
import { ReactComponent as AddIconPink } from "../../assets/img/add-icon-pink.svg";
import { LpTokenAsset } from "../../app/types";
import { t } from "i18next";

type PoolDataCardProps = {
  tokenPair: string;
  nativeTokens: string;
  nativeTokenIcon: string;
  assetTokens: string;
  assetTokenIcon: string;
  lpTokenAsset: LpTokenAsset | null;
};

const PoolDataCard = ({
  tokenPair,
  nativeTokens,
  assetTokens,
  lpTokenAsset,
  nativeTokenIcon,
  assetTokenIcon,
}: PoolDataCardProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-6">
      <div className="flex gap-2">
        <div className="relative flex basis-2/5 flex-col font-unbounded-variable">
          <div className="relative flex">
            <span className="">
              <img src={nativeTokenIcon} alt="native icon" width={32} height={32} />
            </span>
            <span className="relative right-2">
              <img src={assetTokenIcon} alt="asset icon" width={32} height={32} />
            </span>
          </div>
          {tokenPair}
        </div>
        <div className="flex basis-3/5 flex-col items-end justify-end gap-2">
          <Button
            onClick={() => console.log("click")}
            variant={ButtonVariants.btnPrimaryGhostSm}
            icon={<AddIconPink width={14} height={14} />}
          >
            {t("button.deposit")}
          </Button>
          <Button onClick={() => console.log("click")} variant={ButtonVariants.btnSecondaryGray}>
            {t("button.withdraw")}
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex basis-1/2 flex-col items-center justify-end">
          <div className="flex flex-col items-start">
            <span className="flex gap-1 text-large font-medium">
              <img src={nativeTokenIcon} alt="assetToken" width={16} height={16} />
              {nativeTokens}
            </span>
            <span className="flex gap-1 text-large font-medium">
              <img src={assetTokenIcon} alt="assetToken" width={16} height={16} />
              {assetTokens}
            </span>
          </div>
          <p className="text-small font-medium uppercase text-text-color-label-light">
            {t("poolDataCard.totalTokensLocked")}
          </p>
        </div>
        <div className="flex basis-1/2 flex-col items-center justify-end text-large font-medium">
          <span>{lpTokenAsset?.balance ? lpTokenAsset.balance.replace(/[, ]/g, "") : 0}</span>
          <p className="text-small font-medium uppercase text-text-color-label-light">{t("poolDataCard.lpTokens")}</p>
        </div>
      </div>
    </div>
  );
};

export default PoolDataCard;
