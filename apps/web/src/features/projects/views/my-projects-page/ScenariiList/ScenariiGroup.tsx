import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import NewScenarioTile from "./ScenarioTile/NewScenarioTile";
import ProjectScenarioTile from "./ScenarioTile/ProjectScenarioTile";
import StatuQuoScenarioTile from "./ScenarioTile/StatuQuoScenarioTile";
import { ReconversionProjectList } from ".";

type Props = {
  siteId: string;
  siteName: string;
  isFriche: boolean;
  reconversionProjects: ReconversionProjectList;
  selectedIds: string[];
  selectableIds: string[];
  onChangeSelectedSite: (value?: string) => void;
  onChangeSelectedProject: (id: string, checked: boolean) => void;
};

function SiteName({ children }: { children: ReactNode }) {
  return <h4>{children}</h4>;
}

function GridColumn({ children }: { children: ReactNode }) {
  return <div className={fr.cx("fr-col-4")}>{children}</div>;
}

function ScenariiGroup({
  siteId,
  siteName,
  isFriche,
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
        <p>{reconversionProjects.length + 1} futurs possibles pour ce site :</p>
      ) : (
        <p>1 futur possible pour ce site :</p>
      )}
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        <GridColumn>
          <StatuQuoScenarioTile
            siteName={siteName}
            siteId={siteId}
            onChangeSelectedSite={onChangeSelectedSite}
            selectedIds={selectedIds}
            selectableIds={selectableIds}
            isFriche={isFriche}
            // TODO : get this information from api
            yearlyProfit={-391179}
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
                // TODO : get these information from api
                yearlyProfit={425968}
                type="PHOTOVOLTAIC_POWER_PLANT"
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
