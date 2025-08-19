import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { ReactNode, useState } from "react";

import classNames from "../../clsx";
import InfoTooltip from "../InfoTooltip/InfoTooltip";

type Props = {
  title: ReactNode;
  buttonProps?: ButtonProps;
  children: ReactNode;
  tooltip?: string;
};

export default function Section({ children, title, tooltip, buttonProps }: Props) {
  const [displaySectionContent, setDisplaySectionContent] = useState(true);
  const onToggleSection = () => {
    setDisplaySectionContent((displaySectionContent) => !displaySectionContent);
  };
  return (
    <section className="tw-mb-10">
      <div className="tw-flex tw-justify-between tw-items-center">
        <div className="tw-flex tw-items-center tw-justify-between tw-flex-grow">
          <span className="tw-flex tw-items-center">
            <h3 className="tw-text-lg tw-mb-0">{title}</h3>
            {tooltip && <InfoTooltip title={tooltip} />}
          </span>

          {buttonProps && <Button className="tw-mx-2" size="small" {...buttonProps} />}
        </div>

        <Button
          className={classNames(
            "tw-my-2",
            "tw-border tw-border-solid tw-border-borderGrey",
            "tw-bg-white",
            "tw-text-black",
            "tw-rounded-sm",
            "tw-shadow-none",
            "dark:tw-bg-grey-dark",
            "dark:tw-text-white",
          )}
          size="small"
          iconId={displaySectionContent ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line"}
          onClick={onToggleSection}
          priority="secondary"
          title={displaySectionContent ? "Fermer la section" : "Afficher la section"}
        />
      </div>
      {displaySectionContent && children}
    </section>
  );
}
