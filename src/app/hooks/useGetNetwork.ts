import { NETWORKS } from "../../networkConfig";
import { NetworkKeys } from "../types/enum";

const useGetNetwork = () => {
  const network = window.sessionStorage.getItem("network");

  if (network) {
    return NETWORKS[network as NetworkKeys];
  } else {
    window.sessionStorage.setItem("network", NetworkKeys.Kusama);
    return NETWORKS[NetworkKeys.Kusama];
  }
};

export default useGetNetwork;
