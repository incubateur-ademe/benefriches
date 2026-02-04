import Button from "@codegouvfr/react-dsfr/Button";
import { DevelopmentPlanType } from "shared";

import { getScenarioPictoUrl } from "@/features/projects/views/shared/scenarioType";
import classNames, { ClassValue } from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";
import { routes } from "@/shared/views/router";

import ProjectTile from "./ProjectTile";
import ProjectTileMenu from "./ProjectTileMenu";
import { useProjectTileMenu } from "./useProjectTileMenu";

type Props = {
  projectType: DevelopmentPlanType;
  projectName: string;
  siteName: string;
  id: string;
  isExpressProject: boolean;
  className?: ClassValue;
};

function ProjectOverviewTile({
  projectType,
  projectName,
  siteName,
  id,
  isExpressProject,
  className,
}: Props) {
  const { isMenuOpened, openMenu, menuRef, menuButtonRef, closeMenu } = useProjectTileMenu();

  return (
    <div className="relative">
      <ProjectTile
        className={classNames("justify-start", className)}
        {...routes.projectImpacts({
          projectId: id,
        }).link}
        title={`Voir les impacts de « ${projectName} »`}
      >
        <Button
          ref={menuButtonRef}
          title={isMenuOpened ? "Fermer le menu" : "Ouvrir le menu d'actions"}
          aria-expanded={isMenuOpened}
          aria-haspopup="menu"
          priority="tertiary no outline"
          iconId="fr-icon-more-fill"
          className="text-text-light hover:bg-white hover:dark:bg-black absolute top-0.5 right-0.5"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            openMenu();
          }}
        />

        <img
          className="fr-responsive-img w-20 pt-4"
          src={getScenarioPictoUrl(projectType)}
          aria-hidden
          alt=""
          width="80"
          height="80"
        />

        <h4
          title={`Évaluation de « ${projectName} » sur « ${siteName} »`}
          aria-label={`Évaluation de « ${projectName} » sur « ${siteName} »`}
          className={classNames("text-lg mb-0 text-center line-clamp-2", isMenuOpened && "hidden")}
        >
          {projectName}
        </h4>

        {isExpressProject && (
          <Badge small className="mt-2" style="blue">
            Projet express
          </Badge>
        )}
      </ProjectTile>

      <ProjectTileMenu
        isOpen={isMenuOpened}
        projectId={id}
        projectName={projectName}
        siteName={siteName}
        projectType={projectType}
        isExpressProject={isExpressProject}
        onClose={closeMenu}
        menuRef={menuRef}
        buttonRef={menuButtonRef}
      />
    </div>
  );
}

export default ProjectOverviewTile;
