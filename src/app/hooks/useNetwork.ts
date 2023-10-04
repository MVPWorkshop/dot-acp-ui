import { NETWORKS } from "../../networkConfig";
import { NetworkKeys } from "../../app/types/enum";

const getNetwork = () => {
  const network = import.meta.env.VITE_NETWORK_NAME as NetworkKeys;
  return NETWORKS[network];
};

export default getNetwork;
