import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { FricheActivity } from "shared";
import NewScenarioTile from "./ScenarioTile/NewScenarioTile";
import ProjectScenarioTile from "./ScenarioTile/ProjectScenarioTile";
import StatuQuoScenarioTile from "./ScenarioTile/StatuQuoScenarioTile";
import { ReconversionProjectList } from ".";

import classNames from "@/shared/views/clsx";

type Props = {
  siteId: string;
  siteName: string;
  reconversionProjects: ReconversionProjectList;
  selectedIds: string[];
  selectableIds: string[];
  onChangeSelectedSite: (value?: string) => void;
  onChangeSelectedProject: (id: string, checked: boolean) => void;
  isFriche: boolean;
  fricheActivity?: FricheActivity;
};

function SiteName({ children }: { children: ReactNode }) {
  return <h4>{children}</h4>;
}

function GridColumn({ children }: { children: ReactNode }) {
  return (
    <div className={classNames(fr.cx("fr-col-md-3", "fr-col-sm-6"), "tw-w-full")}>{children}</div>
  );
}

function ScenariiGroup({
  siteId,
  siteName,
  isFriche,
  fricheActivity,
  reconversionProjects,
  selectedIds,
  selectableIds,
  onChangeSelectedSite,
  onChangeSelectedProject,
}: Props) {
  return (
    <div className="fr-mb-5w" key={siteId}>
      <SiteName key={siteId}>{siteName}</SiteName>
      {reconversionProjects.length > 0 ? (
        <p>{reconversionProjects.length + 1} scenarii possibles pour ce site :</p>
      ) : (
        <p>1 scenario possible pour ce site :</p>
      )}
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        <GridColumn>
          <StatuQuoScenarioTile
            isFriche={isFriche}
            fricheActivity={fricheActivity}
            siteId={siteId}
            onChangeSelectedSite={onChangeSelectedSite}
            selectedIds={selectedIds}
            selectableIds={selectableIds}
          />
        </GridColumn>
        {reconversionProjects.map((project) => {
          return (
            <GridColumn key={project.id}>
              <ProjectScenarioTile
                name={project.name}
                id={project.id}
                selectedIds={selectedIds}
                selectableIds={selectableIds}
                onChangeSelectedProject={onChangeSelectedProject}
                type={project.type}
              />
            </GridColumn>
          );
        })}
        <GridColumn>
          <NewScenarioTile siteId={siteId} />
        </GridColumn>
      </div>
    </div>
  );
}

export default ScenariiGroup;
