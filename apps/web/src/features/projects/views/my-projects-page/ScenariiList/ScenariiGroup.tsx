import { FricheActivity } from "shared";

import Badge from "@/shared/views/components/Badge/Badge";
import { routes } from "@/shared/views/router";

import { ReconversionProjectList } from ".";
import ProjectScenarioTile from "./ProjectScenarioTile";
import NewScenarioTile from "./ScenarioTile/NewScenarioTile";
import StatuQuoScenarioTile from "./StatuQuoScenarioTile";

type Props = {
  siteId: string;
  siteName: string;
  isExpressSite: boolean;
  reconversionProjects: ReconversionProjectList;
  selectedIds: string[];
  selectableIds: string[];
  onChangeSelectedSite: (value?: string) => void;
  onChangeSelectedProject: (id: string, checked: boolean) => void;
  isFriche: boolean;
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
        <Badge small className="tw-ml-3" style="green-tilleul">
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
  isFriche,
  fricheActivity,
  reconversionProjects,
  selectedIds,
  selectableIds,
  onChangeSelectedSite,
  onChangeSelectedProject,
}: Props) {
  return (
    <div className="tw-mb-10">
      <ScenarioGroupTitle siteName={siteName} siteId={siteId} isExpressSite={isExpressSite} />
      {reconversionProjects.length > 0 ? (
        <p>{reconversionProjects.length + 1} scenarii possibles pour ce site :</p>
      ) : (
        <p>1 scenario possible pour ce site :</p>
      )}
      <div className="tw-grid sm:tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-6">
        <StatuQuoScenarioTile
          isFriche={isFriche}
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
