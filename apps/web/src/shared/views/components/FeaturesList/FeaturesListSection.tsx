import { ReactNode, useState } from "react";
import Button from "@codegouvfr/react-dsfr/Button";
import classNames from "../../clsx";

export default function Section({ children, title }: { title: ReactNode; children: ReactNode }) {
  const [displaySectionContent, setDisplaySectionContent] = useState(true);
  const onToggleSection = () => {
    setDisplaySectionContent((displaySectionContent) => !displaySectionContent);
  };
  return (
    <section className="tw-mb-10">
      <div className="tw-flex tw-justify-between tw-items-center">
        <h3 className="tw-text-lg tw-mb-2">{title}</h3>{" "}
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
