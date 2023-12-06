import { NETWORKS } from "../../networkConfig";
import { NetworkKeys } from "../types/enum";

const useGetNetwork = () => {
  const network = window.sessionStorage.getItem("network");
  return NETWORKS[network as NetworkKeys];
};

export default useGetNetwork;
