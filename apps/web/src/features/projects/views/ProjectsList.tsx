import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { ProjectsBySite } from "../domain/projects.types";
import NewProjectButton from "./NewProjectButton";
import ProjectCard from "./ProjectCard";

type Props = {
  projectsList: ProjectsBySite[];
};

function SiteName({ children }: { children: ReactNode }) {
  return <h4 style={{ textDecoration: "underline" }}>{children}</h4>;
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
              <ProjectCard
                name={projectGroup.siteName}
                isReconversionProject={false}
              />
            </GridColumn>
            {projectGroup.projects.map((project) => {
              return (
                <GridColumn key={project.id}>
                  <ProjectCard name={project.name} isReconversionProject />
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
