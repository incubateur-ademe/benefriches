import Button from "@codegouvfr/react-dsfr/Button";
import { RefObject } from "react";
import { DevelopmentPlanType } from "shared";

import useDuplicateProject from "@/features/projects/views/project-page/useDuplicateProject";

import classNames from "../../clsx";
import { routes } from "../../router";

type ProjectTileMenuProps = {
  isOpen: boolean;
  projectId: string;
  projectName: string;
  siteName: string;
  projectType: DevelopmentPlanType;
  isExpressProject: boolean;
  onClose: () => void;
  menuRef: RefObject<HTMLDivElement | null>;
  buttonRef: RefObject<HTMLButtonElement | null>;
  from: "evaluations" | "site";
};

function ProjectTileMenu({
  isOpen,
  projectId,
  projectName,
  siteName,
  projectType,
  isExpressProject,
  onClose,
  menuRef,
  buttonRef,
  from,
}: ProjectTileMenuProps) {
  const { onDuplicateProject } = useDuplicateProject(projectId, from);

  return (
    <div
      className={classNames(
        "w-full h-full absolute top-0 left-0 flex flex-col border rounded-lg",
        !isOpen && "invisible pointer-events-none",
      )}
    >
      <div
        className={classNames(
          "flex",
          isOpen ? "justify-between bg-grey-light dark:bg-grey-dark rounded-t-lg" : "justify-end",
        )}
      >
        <h4
          className={classNames(
            !isOpen && "hidden",
            "pl-4 pt-2.5 text-sm text-left mb-0 max-w-[calc(100%-40px)]",
          )}
        >
          <span className="line-clamp-1">{projectName}</span>
        </h4>
        <Button
          ref={buttonRef}
          title={isOpen ? "Fermer le menu" : "Ouvrir le menu d'actions"}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          priority="tertiary no outline"
          iconId={isOpen ? "fr-icon-close-line" : "fr-icon-more-fill"}
          className="text-text-light hover:bg-white hover:dark:bg-black mr-0.5 mt-0.5"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClose();
          }}
        />
      </div>

      <div
        ref={menuRef}
        role="menu"
        aria-label={`Menu d'actions pour ${projectName}`}
        className="rounded-b-lg bg-grey-light dark:bg-grey-dark text-left gap-1 grow"
      >
        <Button
          linkProps={{ ...routes.projectImpacts({ projectId }).link, role: "menuitem" }}
          iconId="fr-icon-add-line"
          className="py-1.5 px-4 w-full hover:bg-white hover:dark:bg-black"
          priority="tertiary no outline"
          size="small"
          title={`Voir les impacts de l'évaluation de « ${projectName} » sur « ${siteName} »`}
        >
          Voir en détails
        </Button>
        {/* <Button
          iconId="fr-icon-file-download-line"
          title={`Télécharger les impacts du projet`}
          className="py-1.5 px-4 w-full hover:bg-white hover:dark:bg-black"
          priority="tertiary no outline"
          size="small"
          nativeButtonProps={{ role: "menuitem" }}
        >
          Télécharger
        </Button> */}
        {!isExpressProject && projectType === "URBAN_PROJECT" && (
          <>
            <Button
              iconId="ri-file-copy-line"
              onClick={onDuplicateProject}
              title={`Créer une variante du projet`}
              className="py-1.5 px-4 w-full hover:bg-white hover:dark:bg-black"
              priority="tertiary no outline"
              size="small"
              nativeButtonProps={{ role: "menuitem" }}
            >
              Évaluer une variante
            </Button>
            <Button
              iconId="fr-icon-edit-line"
              className="py-1.5 px-4 w-full hover:bg-white hover:dark:bg-black"
              priority="tertiary no outline"
              size="small"
              linkProps={{ ...routes.updateProject({ projectId, from }).link, role: "menuitem" }}
              title={`Modifier les caractéristiques du projet`}
            >
              Modifier
            </Button>
          </>
        )}
        {/* <Button
          className="py-1.5 px-4 w-full text-error-ultradark hover:bg-white hover:dark:bg-black"
          priority="tertiary no outline"
          size="small"
          iconId="fr-icon-delete-line"
          title={`Supprimer le projet`}
        >
          Supprimer
        </Button> */}
      </div>
    </div>
  );
}

export default ProjectTileMenu;
