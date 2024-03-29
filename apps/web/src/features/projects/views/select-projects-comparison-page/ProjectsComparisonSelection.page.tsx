import { useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import ProjectCard from "./SelectableProjectCard";

import { routes } from "@/app/views/router";

const STATU_QUO = "STATU_QUO";

export type Props = {
  baseProject: {
    id: string;
    name: string;
    site: {
      id: string;
      name: string;
    };
  };
  projectsToCompare: { id: string; name: string }[];
};

function ProjectsComparisonSelectionPage({ baseProject, projectsToCompare }: Props) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

  const onSelect = (projectId: string) => () => {
    setSelectedProjectId(projectId);
  };

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <h1>Comparaison des impacts des projets</h1>
      <p>
        A quel futur voulez-vous comparer le projet de <strong>"{baseProject.name}"</strong> sur le
        site <strong>"{baseProject.site.name}"</strong> ?
      </p>
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mb-2w")}>
        <div className={fr.cx("fr-col-3")}>
          <ProjectCard isSelected={selectedProjectId === STATU_QUO} onSelect={onSelect(STATU_QUO)}>
            Site existant
            <p>({baseProject.site.name})</p>
          </ProjectCard>
        </div>
        {projectsToCompare.map((project) => {
          return (
            <div className={fr.cx("fr-col-3")} key={project.id}>
              <ProjectCard
                isSelected={project.id === selectedProjectId}
                onSelect={onSelect(project.id)}
              >
                {project.name}
              </ProjectCard>
            </div>
          );
        })}
      </div>
      <ButtonsGroup
        buttons={[
          {
            priority: "secondary",
            children: "Retour à mes projets",
            linkProps: routes.myProjects().link,
          },
          {
            priority: "primary",
            children: "Comparer les impacts",
            ...(selectedProjectId
              ? {
                  linkProps: routes.compareProjects({
                    baseProjectId: baseProject.id,
                    avecProjet: selectedProjectId,
                  }).link,
                }
              : { disabled: true }),
          },
        ]}
        inlineLayoutWhen="always"
      />
    </section>
  );
}

export default ProjectsComparisonSelectionPage;
