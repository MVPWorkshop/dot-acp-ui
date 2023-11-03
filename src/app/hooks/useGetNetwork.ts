import { NETWORKS } from "../../networkConfig";
import { NetworkKeys } from "../types/enum";

const useGetNetwork = () => {
  const network = process.env.VITE_NETWORK_NAME as NetworkKeys;
  return NETWORKS[network];
};

export default useGetNetwork;
