import { FrCxArg } from "@codegouvfr/react-dsfr";
import "@codegouvfr/react-dsfr/dsfr/utility/icons/icons-system/icons-system.css";
import { ReactNode } from "react";
import { Link } from "type-route";

import classNames from "@/shared/views/clsx";

import Badge from "../Badge/Badge";

type Props = {
  linkProps?: Link;
  title: ReactNode;
  badgeText?: string;
  iconId?: FrCxArg;
  disabled?: boolean;
};

const TileLink = ({ linkProps, title, badgeText, iconId, disabled }: Props) => {
  return (
    <div
      className={classNames(
        "tw-border-solid",
        "tw-border",
        "tw-rounded-lg",
        "tw-p-6",
        "tw-h-60",
        "tw-bg-white dark:tw-bg-black",
        disabled ? "tw-border-dsfr-greyDisabled" : "tw-border-dsfr-borderBlue",
        !disabled && "hover:tw-bg-dsfr-altBlue hover:dark:tw-bg-grey-dark",
      )}
    >
      <a
        {...(disabled ? {} : linkProps)}
        className={classNames(
          "tw-w-full",
          "tw-h-full",
          "tw-flex",
          "tw-flex-col",
          "tw-items-center",
          "tw-justify-center",
          "tw-text-center",
          "lg:tw-text-lg",
          "tw-font-medium",
          "tw-bg-none",
          "tw-gap-6",
          disabled
            ? ["tw-text-text-light", "dark:tw-text-dsfr-greyDisabled"]
            : ["tw-text-dsfr-titleBlue"],
        )}
      >
        {iconId && <span aria-hidden="true" className={classNames("fr-icon--xl", iconId)} />}
        {title}
        {badgeText && (
          <Badge small style={disabled ? "disabled" : undefined}>
            {badgeText}
          </Badge>
        )}
      </a>
    </div>
  );
};

export default TileLink;
