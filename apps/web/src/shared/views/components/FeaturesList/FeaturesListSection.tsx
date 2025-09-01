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
    <section className="mb-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-between grow">
          <span className="flex items-center">
            <h3 className="text-lg mb-0">{title}</h3>
            {tooltip && <InfoTooltip title={tooltip} />}
          </span>

          {buttonProps && <Button className="mx-2" size="small" {...buttonProps} />}
        </div>

        <Button
          className={classNames(
            "my-2",
            "border border-solid border-border-grey",
            "bg-white",
            "text-black",
            "rounded-xs",
            "shadow-none",
            "dark:bg-grey-dark",
            "dark:text-white",
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
