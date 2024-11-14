import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { useState } from "react";

import { routes } from "@/app/views/router";
import { ReconversionProjectImpactsResult } from "@/features/projects/application/fetchReconversionProjectImpacts.action";
import {
  ImpactCategoryFilter,
  ViewMode,
} from "@/features/projects/application/projectImpacts.reducer";
import { getEconomicBalanceProjectImpacts } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { getEnvironmentalProjectImpacts } from "@/features/projects/domain/projectImpactsEnvironmental";
import { getSocialProjectImpacts } from "@/features/projects/domain/projectImpactsSocial";
import {
  getDetailedSocioEconomicProjectImpacts,
  getSocioEconomicProjectImpactsByActor,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import { getKeyImpactIndicatorsList } from "@/features/projects/domain/projectKeyImpactIndicators";
import { ProjectFeatures, UrbanProjectFeatures } from "@/features/projects/domain/projects.types";
import ProjectImpactsActionBar from "@/features/projects/views/project-page/header/ProjectImpactsActionBar";
import ProjectPageHeader from "@/features/projects/views/project-page/header/ProjectPageHeader";
import ImpactsChartsView from "@/features/projects/views/project-page/impacts/charts-view/ImpactsChartsView";
import {
  ImpactDescriptionModalCategory,
  ImpactDescriptionModalWizard,
} from "@/features/projects/views/project-page/impacts/impact-description-modals/ImpactDescriptionModalWizard";
import ImpactsListView from "@/features/projects/views/project-page/impacts/list-view/ImpactsListView";
import ImpactSummaryView from "@/features/projects/views/project-page/impacts/summary-view/ImpactSummaryView";
import classNames from "@/shared/views/clsx";

type Props = {
  siteData: { name: string; id: string } & ReconversionProjectImpactsResult["siteData"];
  projectData: Omit<ProjectFeatures, "developmentPlan"> & { developmentPlan: UrbanProjectFeatures };
  impactsData: ReconversionProjectImpactsResult["impacts"];
};

function DemoProjectImpacts({ projectData, siteData, impactsData }: Props) {
  const [evaluationPeriod, setEvaluationPeriod] = useState<number>(20);
  const [currentCategoryFilter, setCategoryFilter] = useState<ImpactCategoryFilter>("all");
  const [currentViewMode, setViewMode] = useState<ViewMode>("summary");
  const [modalCategoryOpened, setModalCategoryOpened] =
    useState<ImpactDescriptionModalCategory>(undefined);

  const onCurrentCategoryFilterChange = (category: ImpactCategoryFilter) => {
    setCategoryFilter(category);
  };

  const headerProps = {
    projectType: projectData.developmentPlan.type,
    projectFeaturesData: projectData,
    projectName: projectData.name,
    siteName: siteData.name,
    isExpressProject: false,
    siteFeaturesHref: routes.demoSiteFeatures({ siteId: siteData.id }).href,
    onGoToImpactsOnBoarding: () => {
      routes.demoProjectImpactsOnboarding({ projectId: projectData.id }).push();
    },
  };

  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isSmScreen = windowInnerWidth < breakpointsValues.sm;

  return (
    <div
      id="project-impacts-page"
      className={classNames("tw-bg-grey-light dark:tw-bg-grey-dark", "tw-h-full")}
    >
      <div className="tw-py-8">
        <ProjectPageHeader {...headerProps} isSmall={isSmScreen} />
      </div>

      <div className="fr-container">
        <ProjectImpactsActionBar
          selectedFilter={currentCategoryFilter}
          selectedViewMode={currentViewMode}
          evaluationPeriod={evaluationPeriod}
          onFilterClick={onCurrentCategoryFilterChange}
          onViewModeClick={(newViewMode: ViewMode) => {
            setViewMode(newViewMode);
          }}
          onEvaluationPeriodChange={(newEvaluationPeriod: number) => {
            setEvaluationPeriod(newEvaluationPeriod);
          }}
          isSmScreen={isSmScreen}
          headerProps={headerProps}
        />

        <ImpactDescriptionModalWizard
          modalCategory={modalCategoryOpened}
          onChangeModalCategoryOpened={setModalCategoryOpened}
          projectData={{
            soilsDistribution: projectData.soilsDistribution,
            contaminatedSoilSurface:
              (projectData.decontaminatedSoilSurface ?? 0) - siteData.contaminatedSoilSurface,
            developmentPlan: {
              type: "URBAN_PROJECT",
              buildingsFloorAreaDistribution: projectData.developmentPlan.buildingsFloorArea,
            },
          }}
          siteData={{
            soilsDistribution: siteData.soilsDistribution,
            contaminatedSoilSurface: siteData.contaminatedSoilSurface,
            addressLabel: siteData.addressLabel,
            surfaceArea: siteData.surfaceArea,
          }}
          impactsData={impactsData}
        />
        {currentViewMode === "summary" && (
          <ImpactSummaryView
            categoryFilter={currentCategoryFilter}
            keyImpactIndicatorsList={getKeyImpactIndicatorsList(impactsData, siteData)}
          />
        )}
        {currentViewMode === "list" && (
          <ImpactsListView
            openImpactDescriptionModal={setModalCategoryOpened}
            economicBalance={getEconomicBalanceProjectImpacts(
              currentCategoryFilter,
              "URBAN_PROJECT",
              impactsData,
            )}
            socialImpacts={getSocialProjectImpacts(currentCategoryFilter, impactsData)}
            environmentImpacts={getEnvironmentalProjectImpacts(currentCategoryFilter, impactsData)}
            socioEconomicImpacts={getDetailedSocioEconomicProjectImpacts(
              currentCategoryFilter,
              impactsData,
            )}
          />
        )}
        {currentViewMode === "charts" && (
          <ImpactsChartsView
            projectName={projectData.name}
            openImpactDescriptionModal={setModalCategoryOpened}
            economicBalance={getEconomicBalanceProjectImpacts(
              currentCategoryFilter,
              "URBAN_PROJECT",
              impactsData,
            )}
            socialImpacts={getSocialProjectImpacts(currentCategoryFilter, impactsData)}
            environmentImpacts={getEnvironmentalProjectImpacts(currentCategoryFilter, impactsData)}
            socioEconomicImpacts={getSocioEconomicProjectImpactsByActor(
              currentCategoryFilter,
              impactsData,
            )}
          />
        )}
      </div>
    </div>
  );
}

export default DemoProjectImpacts;
