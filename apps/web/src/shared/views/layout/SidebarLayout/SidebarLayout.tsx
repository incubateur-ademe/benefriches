import Button from "@codegouvfr/react-dsfr/Button";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { createContext, ReactNode, useState } from "react";

import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";

type SidebarLayoutProps = {
  mainChildren: ReactNode;
  sidebarChildren: ReactNode;
  title: ReactNode;
};

export const SidebarLayoutContext = createContext(false);

function SidebarLayout({ mainChildren, title, sidebarChildren }: SidebarLayoutProps) {
  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const [isOpen, setOpen] = useState(windowInnerWidth < breakpointsValues.lg ? false : true);

  return (
    <SidebarLayoutContext.Provider value={isOpen}>
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
            {isOpen && (
              <a
                {...routes.myProjects().link}
                className="tw-no-underline"
                aria-description="Retour à mes projets"
              >
                <img src="/img/logos/logo-benefriches-simple.svg" alt="Logo de Bénéfriches" />
              </a>
            )}
            <Button
              className="tw-text-grey-dark"
              iconId={
                isOpen ? "fr-icon-arrow-left-s-line-double" : "fr-icon-arrow-right-s-line-double"
              }
              onClick={() => {
                setOpen((current) => !current);
              }}
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
    </SidebarLayoutContext.Provider>
  );
}

export default SidebarLayout;
