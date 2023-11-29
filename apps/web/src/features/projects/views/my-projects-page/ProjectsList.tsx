import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { ProjectsGroupedBySite } from "../../domain/projects.types";
import NewProjectButton from "./NewProjectButton";

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
          <p>
            {projectGroup.projects.length + 1} futurs possibles pour ce site :
          </p>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <GridColumn>
              <Card title="Pas de changement" desc="(site en friche)" border />
            </GridColumn>
            {projectGroup.projects.map((project) => {
              return (
                <GridColumn key={project.id}>
                  <Card
                    title={project.name}
                    enlargeLink
                    linkProps={
                      routes.projectImpacts({ projectId: project.id }).link
                    }
                    border
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
