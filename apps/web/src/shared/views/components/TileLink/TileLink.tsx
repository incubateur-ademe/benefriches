import { FrCxArg } from "@codegouvfr/react-dsfr";
import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
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
  button?: ButtonProps;
  onClick?: () => void;
};

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
      onClick={onClick ?? (() => {})}
      disabled={onClick === undefined}
    >
      <div className={innerContentClasses}>
        {iconId && <span aria-hidden="true" className={classNames("fr-icon--xl", iconId)} />}
        {title}
        {badgeText && (
          <Badge small style="green-tilleul">
            {badgeText}
          </Badge>
        )}
      </div>
      {button && (
        <Button className={button.className} {...button}>
          {button.children}
        </Button>
      )}
    </button>
  );
};

export default TileLink;
