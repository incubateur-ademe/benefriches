import { ReactNode } from "react";
import Button from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";

type SidebarLayoutProps = {
  mainChildren: ReactNode;
  sidebarChildren: ReactNode;
  title: ReactNode;
  isOpen: boolean;
  toggleIsOpen: () => void;
};

function SidebarLayout({
  mainChildren,
  title,
  sidebarChildren,
  isOpen,
  toggleIsOpen,
}: SidebarLayoutProps) {
  return (
    <div className={classNames("tw-flex", "tw-w-full", "tw-h-full")}>
      <div
        className={classNames(
          "tw-bg-grey-light dark:tw-bg-dsfr-contrastGrey",
          "tw-border-r",
          "tw-h-full",
          "tw-z-10",
          isOpen ? "tw-w-80 lg:tw-relative tw-absolute" : "tw-w-20",
        )}
      >
        <div
          className={classNames(
            "tw-flex",
            "tw-py-6",
            "tw-items-center",
            isOpen ? "tw-px-6 tw-justify-between" : "tw-justify-center",
          )}
        >
          {isOpen && <img src="/img/logos/logo-benefriches-simple.svg" alt="Logo de Bénéfriches" />}
          <Button
            className="tw-text-grey-dark"
            iconId={
              isOpen ? "fr-icon-arrow-left-s-line-double" : "fr-icon-arrow-right-s-line-double"
            }
            onClick={toggleIsOpen}
            priority="tertiary no outline"
            title={isOpen ? "Réduire le menu" : "Ouvrir le menu"}
          />
        </div>
        {sidebarChildren}
      </div>

      <div className={classNames("tw-overflow-auto", "tw-w-full")}>
        <div
          className={classNames(
            "tw-flex",
            "tw-justify-between",
            "tw-items-center",
            "tw-p-6",
            "tw-border-solid",
            "tw-border-borderGrey",
            "tw-border-0",
            "tw-border-b",
          )}
        >
          <div className="tw-text-xl tw-font-bold">{title}</div>
          <Button
            priority="tertiary no outline"
            linkProps={routes.myProjects().link}
            iconId="fr-icon-briefcase-fill"
          >
            Retour à mes projets
          </Button>
        </div>

        <div className="tw-p-6 tw-container">{mainChildren}</div>
      </div>
    </div>
  );
}

export default SidebarLayout;
