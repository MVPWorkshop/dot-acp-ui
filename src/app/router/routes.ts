import { t } from "i18next";

const HOME_ROUTE = "/";
const POOLS_ROUTE = "pools";
const ADD_LIQUIDITY = "add-liquidity";
const SWAP_ROUTE = "swap";
const POOLS_ADD_LIQUIDITY = "/pools/add-liquidity";
const POOLS_PAGE = "/pools";

const SEO_ROUTES = {
  [`${POOLS_ROUTE}`]: {
    title: t("seo.pools.title"),
    description: t("seo.pools.description"),
  },
  [`${SWAP_ROUTE}`]: {
    title: t("seo.swap.title"),
    description: t("seo.swap.description"),
  },
};

export { HOME_ROUTE, POOLS_ROUTE, SWAP_ROUTE, ADD_LIQUIDITY, POOLS_ADD_LIQUIDITY, POOLS_PAGE, SEO_ROUTES };
