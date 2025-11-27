import { SiteView } from "../../core/site.types";
import NewProjectTile from "./NewProjectTile";
import EvaluatedProjectTile from "./ProjectTile";

type Props = {
  siteId: string;
  projects: SiteView["reconversionProjects"];
};

export default function EvaluatedProjectsList({ siteId, projects }: Props) {
  return (
    <section>
      <h3 className="text-2xl">Projets évalués</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <EvaluatedProjectTile
            key={project.id}
            projectId={project.id}
            projectName={project.name}
            projectType={project.type}
          />
        ))}
        <NewProjectTile siteId={siteId} />
      </div>
    </section>
  );
}
