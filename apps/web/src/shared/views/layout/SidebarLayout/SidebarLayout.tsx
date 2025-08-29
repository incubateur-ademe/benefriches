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

  const [isOpen, setOpen] = useState(isLessThanLg ? false : true);

  useEffect(() => {
    setOpen(isLessThanLg ? false : true);
  }, [isLessThanLg]);

  return (
    <SidebarLayoutContext.Provider value={{ isOpen }}>
      <div className={classNames("flex", "w-full", "h-[100vh]")}>
        <aside
          className={classNames(
            "bg-grey-light dark:bg-dsfr-contrastGrey",
            "border-r",
            "z-10",
            "flex flex-col",
            !isLessThanLg && "transition-[width]",
            isOpen ? "w-80 lg:relative absolute" : "w-20",
            isOpen && isLessThanLg && "drop-shadow-[0_3px_9px_var(--shadow-color)]",
            "h-full",
          )}
        >
          <div
            className={classNames(
              "flex",
              "py-6",
              "items-center",
              isOpen ? "px-6 justify-between" : "justify-center",
            )}
          >
            {isOpen && (
              <a
                {...routes.myProjects().link}
                className="bg-none"
                aria-description="Retour à mes projets"
              >
                <img src="/img/logos/logo-benefriches-simple.svg" alt="Bénéfriches" />
              </a>
            )}
            <Button
              className="text-grey-dark"
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
          <div className="flex-1 flex flex-col justify-between">
            {sidebarChildren}
            <div className="py-4 text-center">
              <HelpButton small={!isOpen} />
            </div>
          </div>
        </aside>

        <div
          className={classNames("overflow-auto", "w-full")}
          onClick={() => {
            if (isOpen && isLessThanLg) {
              setOpen(false);
            }
          }}
        >
          {isLessThanLg && (
            <div
              aria-hidden="true"
              className={classNames(
                "transition-opacity",
                "absolute top-0 left-0 w-screen h-screen",
                "bg-[#161616a3]",
                isOpen ? "z-[5]" : "z-[-1]",
                isOpen ? "opacity-1" : "opacity-0",
              )}
            ></div>
          )}
          <header
            className={classNames(
              "flex",
              "justify-between",
              "items-center",
              "p-6",
              "border-solid",
              "border-borderGrey",
              "border-0",
              "border-b",
            )}
          >
            <div className="text-xl font-bold">{title}</div>
            <Button
              priority="tertiary no outline"
              linkProps={routes.myProjects().link}
              iconId="fr-icon-briefcase-fill"
            >
              Retour à mes projets
            </Button>
          </header>

          <main className="p-6 container">{mainChildren}</main>
        </div>
      </div>
    </SidebarLayoutContext.Provider>
  );
}

export default SidebarLayout;
