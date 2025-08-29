import { FricheActivity, SiteNature } from "shared";

import Badge from "@/shared/views/components/Badge/Badge";
import { routes } from "@/shared/views/router";

import { ReconversionProjectList } from ".";
import ProjectScenarioTile from "./ProjectScenarioTile";
import NewScenarioTile from "./ScenarioTile/NewScenarioTile";
import StatuQuoScenarioTile from "./StatuQuoScenarioTile";

type Props = {
  siteId: string;
  siteName: string;
  siteNature: SiteNature;
  isExpressSite: boolean;
  reconversionProjects: ReconversionProjectList;
  selectedIds: string[];
  selectableIds: string[];
  onChangeSelectedSite: (value?: string) => void;
  onChangeSelectedProject: (id: string, checked: boolean) => void;
  fricheActivity?: FricheActivity;
};

function ScenarioGroupTitle({
  siteId,
  siteName,
  isExpressSite,
}: {
  siteId: string;
  siteName: string;
  isExpressSite: boolean;
}) {
  return (
    <h4 className="tour-guide-step-created-site">
      <a {...routes.siteFeatures({ siteId }).link}>{siteName}</a>
      {isExpressSite && (
        <Badge small className="ml-3" style="blue">
          Site express
        </Badge>
      )}
    </h4>
  );
}

function ScenariiGroup({
  siteId,
  siteName,
  isExpressSite,
  siteNature,
  fricheActivity,
  reconversionProjects,
  selectedIds,
  selectableIds,
  onChangeSelectedSite,
  onChangeSelectedProject,
}: Props) {
  return (
    <div className="mb-10">
      <ScenarioGroupTitle siteName={siteName} siteId={siteId} isExpressSite={isExpressSite} />
      {reconversionProjects.length > 0 ? (
        <p>{reconversionProjects.length + 1} scenarii possibles pour ce site :</p>
      ) : (
        <p>1 scenario possible pour ce site :</p>
      )}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatuQuoScenarioTile
          siteNature={siteNature}
          fricheActivity={fricheActivity}
          siteId={siteId}
          onChangeSelectedSite={onChangeSelectedSite}
          selectedIds={selectedIds}
          selectableIds={selectableIds}
        />
        {reconversionProjects.map((project) => {
          return (
            <ProjectScenarioTile
              key={project.id}
              name={project.name}
              id={project.id}
              isExpressProject={project.isExpressProject}
              selectedIds={selectedIds}
              selectableIds={selectableIds}
              onChangeSelectedProject={onChangeSelectedProject}
              type={project.type}
            />
          );
        })}
        <NewScenarioTile linkProps={routes.createProject({ siteId }).link} />
      </div>
    </div>
  );
}

export default ScenariiGroup;
