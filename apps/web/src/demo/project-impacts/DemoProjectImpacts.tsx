import { useState } from "react";

import { ReconversionProjectImpactsResult } from "@/features/projects/application/fetchImpactsForReconversionProject.action";
import { ViewMode } from "@/features/projects/application/projectImpacts.reducer";
import {
  getEnvironmentalAreaChartImpactsData,
  getSocialAreaChartImpactsData,
} from "@/features/projects/domain/projectImpactsAreaChartsData";
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
import AboutImpactsModal from "@/features/projects/views/project-page/impacts/about-impacts-modal/AboutImpactsModal";
import ImpactsChartsView from "@/features/projects/views/project-page/impacts/charts-view/ImpactsChartsView";
import ImpactModalDescriptionProvider from "@/features/projects/views/project-page/impacts/impact-description-modals/ImpactModalDescriptionProvider";
import ImpactsListView from "@/features/projects/views/project-page/impacts/list-view/ImpactsListView";
import ProjectFeaturesModal from "@/features/projects/views/project-page/impacts/project-features-modal/ProjectFeaturesModal";
import ImpactSummaryView from "@/features/projects/views/project-page/impacts/summary-view/ImpactSummaryView";
import classNames from "@/shared/views/clsx";
import { routes } from "@/shared/views/router";

import { getImpactsDataFromEvaluationPeriod } from "../demoData";

type Props = {
  siteData: { name: string; id: string } & ReconversionProjectImpactsResult["siteData"];
  projectData: Omit<ProjectFeatures, "developmentPlan"> & { developmentPlan: UrbanProjectFeatures };
  impactsData: ReconversionProjectImpactsResult["impacts"];
};

function DemoProjectImpacts({ projectData, siteData, impactsData: impactsDataFor1Year }: Props) {
  const [evaluationPeriod, setEvaluationPeriod] = useState<number>(20);
  const [currentViewMode, setViewMode] = useState<ViewMode>("summary");

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

  const impactsData = getImpactsDataFromEvaluationPeriod(impactsDataFor1Year, evaluationPeriod);

  return (
    <div
      id="project-impacts-page"
      className={classNames("tw-bg-grey-light dark:tw-bg-grey-dark", "tw-h-full")}
    >
      <div className="tw-py-8">
        <ProjectPageHeader {...headerProps} />
      </div>

      <div className="fr-container">
        <ProjectImpactsActionBar
          selectedViewMode={currentViewMode}
          evaluationPeriod={evaluationPeriod}
          onViewModeClick={(newViewMode: ViewMode) => {
            setViewMode(newViewMode);
          }}
          onEvaluationPeriodChange={(newEvaluationPeriod: number) => {
            setEvaluationPeriod(newEvaluationPeriod);
          }}
          headerProps={headerProps}
        />

        <ImpactModalDescriptionProvider
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
        >
          <>
            {currentViewMode === "summary" && (
              <ImpactSummaryView
                keyImpactIndicatorsList={getKeyImpactIndicatorsList(impactsData, siteData)}
              />
            )}
            {currentViewMode === "list" && (
              <ImpactsListView
                economicBalance={getEconomicBalanceProjectImpacts("URBAN_PROJECT", impactsData)}
                socialImpacts={getSocialProjectImpacts(impactsData)}
                environmentImpacts={getEnvironmentalProjectImpacts(impactsData)}
                socioEconomicImpacts={getDetailedSocioEconomicProjectImpacts(impactsData)}
              />
            )}
            {currentViewMode === "charts" && (
              <ImpactsChartsView
                projectName={projectData.name}
                economicBalance={getEconomicBalanceProjectImpacts("URBAN_PROJECT", impactsData)}
                socialAreaChartImpactsData={getSocialAreaChartImpactsData(impactsData)}
                environmentalAreaChartImpactsData={getEnvironmentalAreaChartImpactsData({
                  projectContaminatedSurfaceArea: 0,
                  siteContaminatedSurfaceArea: 0,
                  impactsData,
                })}
                socioEconomicImpactsByActor={getSocioEconomicProjectImpactsByActor(impactsData)}
                socioEconomicTotalImpact={impactsData.socioeconomic.total}
              />
            )}
          </>
        </ImpactModalDescriptionProvider>
      </div>
      <AboutImpactsModal />
      <ProjectFeaturesModal projectFeaturesData={projectData} isOpen />
    </div>
  );
}

export default DemoProjectImpacts;
