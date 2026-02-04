import ProjectOverviewTile from "@/shared/views/components/ProjectTile/ProjectOverviewTile";

import NewProjectTile from "../../../../shared/views/components/ProjectTile/NewProjectTile";
import { SiteView } from "../../core/site.types";

type Props = {
  siteId: string;
  siteName: string;
  projects: SiteView["reconversionProjects"];
};

export default function EvaluatedProjectsList({ siteId, siteName, projects }: Props) {
  return (
    <section>
      <h3 className="text-2xl">Projets évalués</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectOverviewTile
            key={project.id}
            id={project.id}
            projectName={project.name}
            projectType={project.type}
            siteName={siteName}
            isExpressProject={project.express}
            className="w-full h-60"
          />
        ))}
        <NewProjectTile siteId={siteId} className="w-full h-60" />
      </div>
    </section>
  );
}
