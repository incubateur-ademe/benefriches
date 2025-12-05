import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode, useContext } from "react";

import classNames from "@/shared/views/clsx";
import { routes } from "@/shared/views/router";

import { SidebarLayoutContext } from "./SidebarLayoutContext";

type SidebarProps = {
  children: ReactNode;
  mode: "compact" | "normal";
  onToggleOpen: () => void;
};

function Sidebar({ children, mode, onToggleOpen }: SidebarProps) {
  const { isOpen } = useContext(SidebarLayoutContext);

  return (
    <aside
      id="barre-laterale"
      className={classNames(
        "bg-grey-light dark:bg-dsfr-contrast-grey",
        "border-r",
        "z-10",
        "flex flex-col",
        mode === "normal" && "transition-[width]",
        isOpen ? "w-80 lg:relative absolute" : "w-20",
        isOpen && mode === "compact" && "drop-shadow-[0_3px_9px_var(--shadow-color)]",
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
            {...routes.myEvaluations().link}
            className="bg-none"
            aria-description="Retour à mes évaluations"
          >
            <img src="/img/logos/logo-benefriches-simple.svg" alt="Bénéfriches" />
          </a>
        )}
        <Button
          className="text-grey-dark"
          iconId={isOpen ? "fr-icon-arrow-left-s-line-double" : "fr-icon-arrow-right-s-line-double"}
          onClick={onToggleOpen}
          priority="tertiary no outline"
          title={isOpen ? "Réduire le menu" : "Ouvrir le menu"}
        />
      </div>
      {children}
    </aside>
  );
}

export default Sidebar;
