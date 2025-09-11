import Button from "@codegouvfr/react-dsfr/Button";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { ReactNode, useEffect, useMemo, useState } from "react";

import classNames from "@/shared/views/clsx";
import { routes } from "@/shared/views/router";

import Sidebar from "./Sidebar";
import { SidebarLayoutContext } from "./SidebarLayoutContext";
import SidebarLayoutFooter from "./SidebarLayoutFooter";

type SidebarLayoutProps = {
  mainChildren: ReactNode;
  sidebarChildren: ReactNode;
  title: ReactNode;
};

function SidebarLayout({ mainChildren, title, sidebarChildren }: SidebarLayoutProps) {
  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isCompactMode = useMemo(
    () => windowInnerWidth < breakpointsValues.lg,
    [breakpointsValues.lg, windowInnerWidth],
  );

  const [isOpen, setOpen] = useState(isCompactMode ? false : true);

  useEffect(() => {
    setOpen(isCompactMode ? false : true);
  }, [isCompactMode]);

  return (
    <SidebarLayoutContext.Provider value={{ isOpen }}>
      <div className={classNames("flex", "flex-col", "w-full", "h-screen", "overflow-y-auto")}>
        <div className={classNames("flex", "w-full", "flex-1")}>
          <Sidebar
            onToggleOpen={() => {
              setOpen((current) => !current);
            }}
            mode={isCompactMode ? "compact" : "normal"}
          >
            {sidebarChildren}
          </Sidebar>

          <div
            className={classNames("overflow-auto", "w-full")}
            onClick={() => {
              if (isOpen && isCompactMode) {
                setOpen(false);
              }
            }}
          >
            {isCompactMode && (
              <div
                aria-hidden="true"
                className={classNames(
                  "transition-opacity",
                  "absolute top-0 left-0 w-screen h-screen",
                  "bg-[#161616a3]",
                  isOpen ? "z-5" : "z-[-1]",
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
                "border-border-grey",
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
        <SidebarLayoutFooter />
      </div>
    </SidebarLayoutContext.Provider>
  );
}

export default SidebarLayout;
