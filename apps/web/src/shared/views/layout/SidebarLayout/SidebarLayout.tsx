import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { ReactNode, useEffect, useMemo, useState } from "react";

import classNames from "@/shared/views/clsx";
import { routes } from "@/shared/views/router";

import Sidebar from "./Sidebar";
// oxlint-disable-next-line no-unassigned-import
import "./SidebarLayout.css";
import { SidebarLayoutContext } from "./SidebarLayoutContext";
import SidebarLayoutFooter from "./SidebarLayoutFooter";

export type SidebarLayoutProps = {
  mainChildren: ReactNode;
  sidebarChildren: ReactNode;
  title: ReactNode;
  header?: "sticky" | "normal";
  actions?: (ButtonProps.Common & {
    title?: string;
    iconId: ButtonProps.WithIcon["iconId"];
    iconPosition?: ButtonProps.WithIcon["iconPosition"];
    children?: ReactNode;
    text: string;
  } & (ButtonProps.AsAnchor | ButtonProps.AsButton))[];
};

const DEFAULT_ACTIONS: SidebarLayoutProps["actions"] = [
  {
    priority: "tertiary no outline",
    linkProps: routes.myEvaluations().link,
    iconId: "fr-icon-briefcase-fill",
    text: "Retour à mes évaluations",
  },
];

function SidebarLayout({
  mainChildren,
  title,
  sidebarChildren,
  actions = DEFAULT_ACTIONS,
  header = "normal",
}: SidebarLayoutProps) {
  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isCompactMode = useMemo(
    () => windowInnerWidth < breakpointsValues.lg,
    [breakpointsValues.lg, windowInnerWidth],
  );

  const [isOpen, setOpen] = useState(!isCompactMode);

  useEffect(() => {
    setOpen(!isCompactMode);
  }, [isCompactMode]);

  return (
    <SidebarLayoutContext.Provider value={{ isOpen }}>
      <div
        className={classNames(
          "sidebar-layout",
          header === "sticky" && "header-sticky",
          "flex",
          "flex-col",
          "w-full",
          "h-screen",
        )}
      >
        <SkipLinks
          links={[
            {
              anchor: "#barre-laterale",
              label: "Barre latérale",
            },
            {
              anchor: "#contenu",
              label: "Contenu",
            },
            {
              anchor: "#footer",
              label: "Pied de page",
            },
          ]}
        />
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
            className={classNames("w-full flex flex-col")}
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
                  "absolute top-0 left-0 w-screen h-full",
                  "bg-text-dark/64",
                  isOpen ? "z-5" : "z-[-1]",
                  isOpen ? "opacity-100" : "opacity-0",
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
                "bg-(--background-default-grey)",
                `h-(--sidebar-layout-header-height)`,
                header === "sticky" && ["sticky", "top-0", "z-4"],
              )}
            >
              <div className="text-lg md:text-xl font-bold">{title}</div>
              {actions && (
                <div className="flex gap-2 md:gap-4">
                  {actions.map((button, index) =>
                    isCompactMode ? (
                      <Button
                        key={`menu-button-${index}`}
                        {...button}
                        title={button.title ? `${button.text} - ${button.title}` : button.text}
                        iconPosition={button.iconPosition ?? "left"}
                        iconId={button.iconId}
                      >
                        {undefined}
                      </Button>
                    ) : (
                      <Button key={`menu-button-${index}`} title={undefined} {...button}>
                        {button.children ?? button.text}
                      </Button>
                    ),
                  )}
                </div>
              )}
            </header>

            <main id="contenu" className={`p-(--sidebar-layout-main-padding) container flex-1`}>
              {mainChildren}
            </main>
          </div>
        </div>
        <SidebarLayoutFooter />
      </div>
    </SidebarLayoutContext.Provider>
  );
}

export default SidebarLayout;
