import Button from "@codegouvfr/react-dsfr/Button";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { ReactNode, useEffect, useMemo, useState } from "react";

import classNames from "@/shared/views/clsx";
import { routes } from "@/shared/views/router";

import HelpButton from "../../components/HelpButton/HelpButton";
import { SidebarLayoutContext } from "./SidebarLayoutContext";

type SidebarLayoutProps = {
  mainChildren: ReactNode;
  sidebarChildren: ReactNode;
  title: ReactNode;
};

function SidebarLayout({ mainChildren, title, sidebarChildren }: SidebarLayoutProps) {
  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isLessThanLg = useMemo(
    () => windowInnerWidth < breakpointsValues.lg,
    [breakpointsValues.lg, windowInnerWidth],
  );

  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isLessThanLg ? false : true);
  }, [isLessThanLg]);

  return (
    <SidebarLayoutContext.Provider value={{ isOpen }}>
      <div className={classNames("tw-flex", "tw-w-full", "tw-h-[100vh]")}>
        <aside
          className={classNames(
            "tw-bg-grey-light dark:tw-bg-dsfr-contrastGrey",
            "tw-border-r",
            "tw-z-10",
            "tw-flex tw-flex-col",
            isOpen ? "tw-w-80 lg:tw-relative tw-absolute" : "tw-w-20",
            isOpen && isLessThanLg && "tw-drop-shadow-[0_3px_9px_var(--shadow-color)]",
            "tw-h-full",
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
                className="tw-bg-none"
                aria-description="Retour à mes projets"
              >
                <img src="/img/logos/logo-benefriches-simple.svg" alt="Bénéfriches" />
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
          <div className="tw-flex-1 tw-flex tw-flex-col tw-justify-between">
            {sidebarChildren}
            <div className="tw-py-4 tw-text-center">
              <HelpButton small={!isOpen} />
            </div>
          </div>
        </aside>

        <div className={classNames("tw-overflow-auto", "tw-w-full")}>
          {isLessThanLg && (
            <div
              aria-hidden="true"
              className={classNames(
                "tw-transition",
                "tw-absolute tw-top-0 tw-left-0 tw-w-screen tw-h-screen",
                "tw-bg-[#161616a3] tw-z-[5]",

                isOpen ? "tw-opacity-1" : "tw-opacity-0",
              )}
            ></div>
          )}
          <header
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
          </header>

          <main className="tw-p-6 tw-container">{mainChildren}</main>
        </div>
      </div>
    </SidebarLayoutContext.Provider>
  );
}

export default SidebarLayout;
