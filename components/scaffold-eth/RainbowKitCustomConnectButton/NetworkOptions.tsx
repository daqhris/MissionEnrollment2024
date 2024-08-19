import { useNetwork, useSwitchNetwork } from "wagmi";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { useNetworkColor } from "../../../hooks/scaffold-eth";
import { getTargetNetworks, ChainWithAttributes } from "../../../utils/scaffold-eth";

const allowedNetworks = getTargetNetworks();

type NetworkOptionsProps = {
  hidden?: boolean;
};

export const NetworkOptions = ({ hidden = false }: NetworkOptionsProps): JSX.Element => {
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const getNetworkColor = useNetworkColor();

  return (
    <>
      {allowedNetworks
        .filter((allowedNetwork: ChainWithAttributes) => allowedNetwork.id !== chain?.id)
        .map((allowedNetwork: ChainWithAttributes) => (
          <li key={allowedNetwork.id} className={hidden ? "hidden" : ""}>
            <button
              className="menu-item btn-sm !rounded-xl flex gap-3 py-3 whitespace-nowrap"
              type="button"
              onClick={() => {
                switchNetwork?.(allowedNetwork.id);
              }}
            >
              <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />
              <span>
                Switch to{" "}
                <span
                  style={{
                    color: getNetworkColor(allowedNetwork),
                  }}
                >
                  {allowedNetwork.name}
                </span>
              </span>
            </button>
          </li>
        ))}
    </>
  );
};
