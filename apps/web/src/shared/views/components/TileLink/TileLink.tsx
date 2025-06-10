import { FrCxArg } from "@codegouvfr/react-dsfr";
import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import "@codegouvfr/react-dsfr/dsfr/utility/icons/icons-system/icons-system.css";
import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

import Badge from "../Badge/Badge";

type Props = {
  title: ReactNode;
  badgeText?: string;
  iconId?: FrCxArg;
} & ({ onClick: () => void; button?: never } | { onClick?: never; button: ButtonProps });

const TileLink = ({ title, badgeText, iconId, onClick, button }: Props) => {
  const innerContentClasses = classNames(
    "tw-h-full",
    "tw-flex",
    "tw-flex-col",
    "tw-items-center",
    "tw-justify-center",
    "tw-text-center",
    "lg:tw-text-lg",
    "tw-font-medium",
    "tw-bg-none",
    "tw-gap-4",
    "!tw-text-dsfr-titleBlue",
  );

  const tileCommonContent = (
    <div className={innerContentClasses}>
      {iconId && <span aria-hidden="true" className={classNames("fr-icon--xl", iconId)} />}
      {title}
      {badgeText && (
        <Badge small style="green-tilleul">
          {badgeText}
        </Badge>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        className={classNames(
          "tw-flex tw-flex-col tw-items-center",
          "tw-border-solid tw-border-dsfr-borderBlue tw-border",
          "tw-rounded-lg",
          "tw-p-6",
          "tw-h-[264px]",
          "tw-bg-white dark:tw-bg-black",
          "hover:tw-bg-dsfr-altBlue",
        )}
        onClick={onClick}
      >
        {tileCommonContent}
      </button>
    );
  }

  return (
    <a
      aria-disabled
      className={classNames(
        "tw-flex tw-flex-col tw-items-center",
        "tw-border-solid tw-border-dsfr-borderBlue tw-border",
        "tw-rounded-lg",
        "tw-p-6",
        "tw-h-[264px]",
        "tw-bg-white dark:tw-bg-black",
        "hover:tw-bg-dsfr-altBlue",
        ["tw-text-text-light", "dark:tw-text-dsfr-greyDisabled"],
      )}
    >
      {tileCommonContent}
      <Button className={button.className} {...button}>
        {button.children}
      </Button>
    </a>
  );
};

export default TileLink;
