import { FrIconClassName } from "@codegouvfr/react-dsfr";
import { Link } from "type-route";

import classNames from "../../clsx";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import Badge from "../Badge/Badge";

type TabItemProps = {
  isActive: boolean;
  label: string;
  linkProps: Link;
  iconId: FrIconClassName;
  beta?: boolean;
};

function TabItem({ isActive, iconId, label, beta, linkProps }: TabItemProps) {
  const isSmallScreen = useIsSmallScreen();
  return (
    <li
      className={classNames(
        isActive
          ? "bg-blue-ultralight text-blue-ultradark dark:bg-blue-dark dark:text-blue-ultralight"
          : "bg-background-light text-[#4f4f4f] dark:bg-gray-700 dark:text-grey-light",
        "rounded-t-lg p-0",
      )}
    >
      <a
        title={isSmallScreen ? label : undefined}
        className={classNames(
          "rounded-t-lg inline-flex items-center gap-2",
          "bg-none px-4 py-2 text-sm font-medium",
        )}
        {...linkProps}
      >
        <i
          className={`${iconId} fr-icon--md text-blue-dark dark:text-blue-ultralight`}
          aria-hidden="true"
        />
        {!isSmallScreen && label}
        {beta && (
          <Badge small style="green-tilleul">
            bêta
          </Badge>
        )}
      </a>
    </li>
  );
}

export default TabItem;
