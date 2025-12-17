import { FrIconClassName } from "@codegouvfr/react-dsfr";
import { Link } from "type-route";

import classNames from "../../clsx";

type TabItemProps = {
  isActive: boolean;
  label: React.ReactNode;
  linkProps: Link;
  iconId: FrIconClassName;
};

function TabItem({ isActive, iconId, label, linkProps }: TabItemProps) {
  return (
    <li
      className={classNames(
        isActive
          ? "bg-blue-ultralight text-blue-ultradark dark:bg-blue-dark dark:text-blue-ultralight"
          : "bg-background-light text-[#4f4f4f] dark:bg-gray-700 dark:text-grey-light",
        "px-4 py-2 text-sm font-medium rounded-t-lg",
      )}
    >
      <a className="bg-none" {...linkProps}>
        <span className="inline-flex items-center gap-2">
          <i
            className={`${iconId} fr-icon--md text-blue-dark dark:text-blue-ultralight`}
            aria-hidden="true"
          />
          {label}
        </span>
      </a>
    </li>
  );
}

export default TabItem;
