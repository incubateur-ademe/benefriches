import { useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { ReconversionProjectImpacts } from "../../domain/impacts.types";
import ProjectsComparisonActionBar from "../shared/actions/ActionBar";
import ImpactsListView from "./list-view/ImpactsListView";
import {
  ImpactDescriptionModal,
  ImpactDescriptionModalCategory,
} from "./modals/ImpactDescriptionModal";
import AboutImpactsModal from "./AboutImpactsModal";
import ImpactsChartsView from "./ImpactsChartsView";
import ProjectsImpactsPageHeader from "./ProjectImpactsPageHeader";

type Props = {
  onEvaluationPeriodChange: (n: number) => void;
  evaluationPeriod: number;
  project: {
    name: string;
    id: string;
    relatedSiteName: string;
  };
  impacts: ReconversionProjectImpacts;
};

type ImpactCategory = "economic" | "environment" | "social";
export type ImpactCategoryFilter = ImpactCategory | "all";

export type ViewMode = "charts" | "list";

const ProjectImpactsPageTabs = () => {
  return (
    <ul
      className={fr.cx("fr-tabs__list", "fr-container", "fr-mx-auto")}
      style={{ marginLeft: "auto", marginRight: "auto" }}
      role="tablist"
    >
      <li role="presentation">
        <button className="fr-tabs__tab" tabIndex={0} role="tab" aria-selected="true">
          Impacts
        </button>
      </li>
      <li role="presentation">
        <button className="fr-tabs__tab" tabIndex={-1} role="tab" disabled>
          Caractéristiques
        </button>
      </li>
    </ul>
  );
};

const ProjectImpactsPage = ({
  project,
  impacts,
  onEvaluationPeriodChange,
  evaluationPeriod,
}: Props) => {
  const [currentFilter, setSelectedFilter] = useState<ImpactCategoryFilter>("all");
  const [currentViewMode, setViewMode] = useState<ViewMode>("charts");

  const [modalCategoryOpened, setModalCategoryOpened] =
    useState<ImpactDescriptionModalCategory>(undefined);

  return (
    <div style={{ background: "#ECF5FD" }}>
      <ProjectsImpactsPageHeader
        projectId={project.id}
        projectName={project.name}
        siteName={project.relatedSiteName}
      />

      <div className={fr.cx("fr-tabs")}>
        <ProjectImpactsPageTabs />
        <div
          className={fr.cx("fr-tabs__panel", "fr-tabs__panel--selected")}
          role="tabpanel"
          style={{ background: fr.colors.decisions.background.default.grey.default }}
        >
          <div className={fr.cx("fr-container")}>
            <ProjectsComparisonActionBar
              selectedFilter={currentFilter}
              selectedViewMode={currentViewMode}
              evaluationPeriod={evaluationPeriod}
              onFilterClick={setSelectedFilter}
              onViewModeClick={setViewMode}
              onEvaluationPeriodChange={onEvaluationPeriodChange}
            />
            <ImpactDescriptionModal
              modalCategory={modalCategoryOpened}
              onChangeModalCategoryOpened={setModalCategoryOpened}
              impacts={impacts}
            />
            {currentViewMode === "charts" && (
              <ImpactsChartsView
                project={project}
                impacts={impacts}
                openImpactDescriptionModal={setModalCategoryOpened}
              />
            )}
            {currentViewMode === "list" && (
              <ImpactsListView
                project={project}
                impacts={impacts}
                openImpactDescriptionModal={setModalCategoryOpened}
              />
            )}
          </div>
        </div>
      </div>
      <AboutImpactsModal />
    </div>
  );
};

export default ProjectImpactsPage;
