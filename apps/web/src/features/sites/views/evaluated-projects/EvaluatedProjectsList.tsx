import classNames from "@/shared/views/clsx";

import { SiteView } from "../../core/site.types";
import NewProjectTile from "./NewProjectTile";
import EvaluatedProjectTile from "./ProjectTile";

type Props = {
  siteId: string;
  projects: SiteView["reconversionProjects"];
};

export default function EvaluatedProjectsList({ siteId, projects }: Props) {
  if (projects.length === 0) {
    return (
      <div className={classNames("fr-container", "py-6")}>
        <p className="text-center text-gray-600">Aucun projet n'a été évalué pour ce site.</p>
      </div>
    );
  }

  return (
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
  );
}
