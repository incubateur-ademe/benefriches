import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { ProjectsGroupedBySite } from "../../domain/projects.types";
import NewProjectButton from "./NewProjectButton";
import ProjectCard from "./ProjectCard";

import { routes } from "@/router";

type Props = {
  projectsList: ProjectsGroupedBySite;
};

function SiteName({ children }: { children: ReactNode }) {
  return <h4>{children}</h4>;
}

function GridColumn({ children }: { children: ReactNode }) {
  return <div className={fr.cx("fr-col-3")}>{children}</div>;
}

function ProjectsList({ projectsList }: Props) {
  return (
    <div>
      {projectsList.map((projectGroup) => (
        <div className="fr-mb-5w" key={projectGroup.siteId}>
          <SiteName key={projectGroup.siteId}>{projectGroup.siteName}</SiteName>
          {projectGroup.projects.length > 0 ? (
            <p>{projectGroup.projects.length + 1} futurs possibles pour ce site :</p>
          ) : (
            <p>1 futur possible pour ce site :</p>
          )}
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <GridColumn>
              <ProjectCard
                projectName="Pas de changement"
                details="(site en friche)"
                yearlyProfit={-391179}
              />
            </GridColumn>
            {projectGroup.projects.map((project) => {
              const projectImpactsLinkProps = routes.projectImpacts({
                projectId: project.id,
              }).link;
              return (
                <GridColumn key={project.id}>
                  <ProjectCard
                    projectName={project.name}
                    impactLinkProps={projectImpactsLinkProps}
                    yearlyProfit={425968}
                  />
                </GridColumn>
              );
            })}
            <GridColumn>
              <NewProjectButton siteId={projectGroup.siteId} />
            </GridColumn>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectsList;
