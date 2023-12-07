import { Key, ReactNode, useState } from "react";
import "./style.scss";
import { NetworkKeys } from "../../../app/types/enum";
import { ReactComponent as RococoIcon } from "../../../assets/img/rococo-icon.svg";
import { ReactComponent as WestendIcon } from "../../../assets/img/westend-icon.svg";
import { ReactComponent as KusamaIcon } from "../../../assets/img/kusama-icon.svg";

type Item = {
  name: string;
};

type SelectNetworkProps = {
  networkSelected?: NetworkKeys;
  type?: HTMLButtonElement["type"];
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  items: Item[];
};

const SelectNetwork = ({ networkSelected, items }: SelectNetworkProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const switchNetwork = (network: string) => {
    window.sessionStorage.setItem("network", network);
    window.location.reload();
  };

  return (
    <div className="relative flex justify-center align-middle">
      <button
        className="flex items-center gap-1 rounded-lg px-4 py-3"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        type="button"
      >
        {networkSelected === NetworkKeys.Kusama && <KusamaIcon />}
        {networkSelected === NetworkKeys.Rococo && <RococoIcon />}
        {networkSelected === NetworkKeys.Westmint && <WestendIcon />}
        {networkSelected}
      </button>
      {isDropdownOpen && (
        <div className="radius absolute top-12 flex flex-col rounded-lg bg-white p-4">
          {items?.map((item: Item, index: Key) => (
            <span key={index}>
              <button onClick={() => switchNetwork(item.name.toLowerCase())}>{item.name}</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectNetwork;
