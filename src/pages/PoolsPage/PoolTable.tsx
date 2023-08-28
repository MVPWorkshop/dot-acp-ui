import Table from "../../components/organism/Table";
import Button from "../../components/atom/Button";
import { ReactComponent as AddToken } from "../../assets/img/add-icon.svg";
import { ReactComponent as DotToken } from "../../assets/img/dot-token.svg";
import { ReactComponent as TestToken } from "../../assets/img/test-token.svg";
import { ButtonText, ButtonVariants } from "../../global/enum";
import { useEffect, useState } from "react";

type PoolProps = {
  name: string;
  tlv: string;
  tokenAIcon: React.ReactNode;
  tokenBIcon: React.ReactNode;
  totalTokensLocked: {
    tokenA: string;
    tokenB: string;
    tokenAIcon: React.ReactNode;
    tokenBIcon: React.ReactNode;
  };
  deposited?: {
    tokenA: string;
    tokenB: string;
    tokenAIcon: React.ReactNode;
    tokenBIcon: React.ReactNode;
  };
};

const PoolMock = [
  {
    name: "DOT–DAI",
    tlv: "$1.26m",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
    deposited: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
  },
  {
    name: "DOT–BUSD",
    tlv: "$15.05m",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
  },
  {
    name: "DOT–ATID",
    tlv: "$103.21m",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
  },
  {
    name: "DOT–WETH",
    tlv: "$24.35m",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
  },
  {
    name: "DOT–ASTR",
    tlv: "$193.45m",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
  },
  {
    name: "DOT–USDT",
    tlv: "$265.35m",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
  },
];

const getPoolTableData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(PoolMock);
    }, 1000);
  });
};

const PoolTable = () => {
  const [poolData, setPoolData] = useState<PoolProps[]>();

  useEffect(() => {
    getPoolTableData().then((data: any) => {
      setPoolData(data);
    });
  }, []);

  return (
    <Table className="w-full">
      <Table.Head>
        <Table.TR className="text-text-color-label-light">
          <Table.TH></Table.TH>
          <Table.TH className="text-start">TLV</Table.TH>
          <Table.TH className="text-start">Total token locked</Table.TH>
          <Table.TH className="text-start">Deposited</Table.TH>
          <Table.TH></Table.TH>
        </Table.TR>
      </Table.Head>
      <Table.Body>
        {poolData?.map((item, index) => {
          return (
            <Table.TR key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-modal-border-color"}`}>
              <Table.TD>
                <div className="relative flex items-center font-unbounded-variable text-heading-6 font-normal">
                  <span className="relative left-2">{item.tokenAIcon}</span>
                  <span className="relative">{item.tokenBIcon}</span>
                  <span className="ml-2">{item.name}</span>
                </div>
              </Table.TD>
              <Table.TD className="text-large">{item.tlv}</Table.TD>
              <Table.TD>
                <div className="text-large">
                  <div className="flex items-center gap-1">
                    <span>{item.totalTokensLocked?.tokenAIcon}</span>
                    {item.totalTokensLocked?.tokenA}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{item.totalTokensLocked?.tokenBIcon}</span>
                    {item.totalTokensLocked?.tokenB}
                  </div>
                </div>
              </Table.TD>
              <Table.TD>
                <div className="text-large">
                  <div className="flex items-center gap-1">
                    <span>{item.deposited?.tokenAIcon}</span>
                    {item.deposited?.tokenA}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{item.deposited?.tokenBIcon}</span>
                    {item.deposited?.tokenB}
                  </div>
                </div>
              </Table.TD>
              <Table.TD>
                <div className="flex h-[38px] w-full justify-end gap-1 text-large">
                  {item.deposited ? (
                    <Button onClick={() => console.log("click")} variant={ButtonVariants.btnSecondary}>
                      Withdraw
                    </Button>
                  ) : null}

                  <Button
                    onClick={() => console.log("click")}
                    variant={ButtonVariants.btnPrimary}
                    size={ButtonText.btnTextSmall}
                    icon={<AddToken />}
                  >
                    Deposit
                  </Button>
                </div>
              </Table.TD>
            </Table.TR>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default PoolTable;
