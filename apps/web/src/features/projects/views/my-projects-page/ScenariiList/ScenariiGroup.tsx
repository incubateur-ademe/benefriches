import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";
import { FricheActivity } from "shared";

import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";

import { ReconversionProjectList } from ".";
import NewScenarioTile from "./NewScenarioTile";
import ProjectScenarioTile from "./ProjectScenarioTile";
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
    <h4 className="tour-guide-step-created-site tw-flex tw-items-center">
      <a {...routes.siteFeatures({ siteId }).link}>{siteName}</a>
      {isExpressSite && (
        <Badge small className="tw-ml-3" style="green-tilleul">
          Site express
        </Badge>
      )}
    </h4>
  );
}

function GridColumn({ children }: { children: ReactNode }) {
  return (
    <div className={classNames(fr.cx("fr-col-md-3", "fr-col-sm-6"), "tw-w-full")}>{children}</div>
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
    <div className="fr-mb-5w" key={siteId}>
      <ScenarioGroupTitle siteName={siteName} siteId={siteId} isExpressSite={isExpressSite} />
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
                isExpressProject={project.isExpressProject}
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
