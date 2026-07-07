import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode, useMemo, useState } from "react";

import { routes } from "@/app/router";
import classNames from "@/shared/views/clsx";

import { SidebarCurrentStepContext } from "./SidebarCurrentStepContext";

type SidebarProps = {
  children: ReactNode;
};

function Sidebar({ children }: SidebarProps) {
  const [isExpandedOnSmallScreen, setExpandedOnSmallScreen] = useState(false);
  const [currentStepLabel, setCurrentStepLabel] = useState("");

  const sidebarCurrentStepContextValue = useMemo(
    () => ({ setCurrentStepLabel }),
    [setCurrentStepLabel],
  );

  return (
    <aside
      id="barre-laterale"
      className={classNames(
        "bg-grey-light dark:bg-dsfr-contrast-grey",
        "border-b lg:border-b-0 lg:border-r",
        "z-10",
        "flex flex-col",
        "w-full lg:w-80",
        "lg:h-full",
      )}
    >
      <div className={classNames("flex", "py-6", "items-center", "px-6", "justify-between gap-4")}>
        <a
          {...routes.myEvaluations().link}
          className="bg-none shrink-0"
          aria-description="Retour à mes évaluations"
        >
          <img src="/img/logos/logo-benefriches-simple.svg" alt="Bénéfriches" />
        </a>
        {!isExpandedOnSmallScreen && currentStepLabel && (
          <span className="truncate text-sm font-bold text-blue-ultradark dark:text-blue-ultralight lg:hidden">
            {currentStepLabel}
          </span>
        )}
        <Button
          className="text-grey-dark lg:hidden shrink-0"
          iconId={isExpandedOnSmallScreen ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line"}
          onClick={() => {
            setExpandedOnSmallScreen((current) => !current);
          }}
          priority="tertiary no outline"
          title={isExpandedOnSmallScreen ? "Réduire le menu" : "Ouvrir le menu"}
          aria-expanded={isExpandedOnSmallScreen}
          aria-controls="barre-laterale-contenu"
        />
      </div>
      <div
        id="barre-laterale-contenu"
        className={classNames(isExpandedOnSmallScreen ? "block" : "hidden", "lg:block")}
      >
        <SidebarCurrentStepContext.Provider value={sidebarCurrentStepContextValue}>
          {children}
        </SidebarCurrentStepContext.Provider>
      </div>
    </aside>
  );
}

export default Sidebar;
