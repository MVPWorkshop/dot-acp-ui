import { ReactComponent as DotToken } from "../../assets/img/dot-token.svg";
import { ReactComponent as TestToken } from "../../assets/img/test-token.svg";

export const PoolMock = [
  {
    name: "DOT–DAI",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
    liquidityPoolTokens: "234.42",
  },
  {
    name: "DOT–BUSD",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
    liquidityPoolTokens: "234.42",
  },
  {
    name: "DOT–ATID",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
    liquidityPoolTokens: "234.42",
  },
  {
    name: "DOT–WETH",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
    liquidityPoolTokens: "234.42",
  },
  {
    name: "DOT–ASTR",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
    liquidityPoolTokens: "234.42",
  },
  {
    name: "DOT–USDT",
    tokenAIcon: <DotToken width={36} height={36} />,
    tokenBIcon: <TestToken width={36} height={36} />,
    totalTokensLocked: {
      tokenA: "234.42",
      tokenB: "436.42",
      tokenAIcon: <DotToken width={16} height={16} />,
      tokenBIcon: <TestToken width={16} height={16} />,
    },
    liquidityPoolTokens: "234.42",
  },
];

export const getPoolTableData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(PoolMock);
    }, 1000);
  });
};
