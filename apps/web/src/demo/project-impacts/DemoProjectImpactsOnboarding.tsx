import { ReconversionProjectImpactsResult } from "@/features/projects/application/fetchReconversionProjectImpacts.action";
import {
  getKeyImpactIndicatorsList,
  getMainKeyImpactIndicators,
  getProjectOverallImpact,
} from "@/features/projects/domain/projectKeyImpactIndicators";
import ProjectImpactsOnboardingPage from "@/features/projects/views/project-impacts-onboarding/ProjectImpactsOnboardingPage";
import { routes } from "@/shared/views/router";

import { getImpactsDataFromEvaluationPeriod } from "../demoData";

type Props = {
  projectId: string;
  siteData: { name: string; id: string } & ReconversionProjectImpactsResult["siteData"];
  impactsData: ReconversionProjectImpactsResult["impacts"];
};

function DemoProjectImpactsOnboarding({
  impactsData: impactsDataFor1Year,
  siteData,
  projectId,
}: Props) {
  const impactsData = getImpactsDataFromEvaluationPeriod(impactsDataFor1Year, 20);
  const keyImpactIndicatorsList = getKeyImpactIndicatorsList(impactsData, siteData);

  return (
    <ProjectImpactsOnboardingPage
      onFinalNext={() => {
        routes.demoProjectImpacts({ projectId }).push();
      }}
      projectOverallImpact={getProjectOverallImpact(keyImpactIndicatorsList)}
      mainKeyImpactIndicators={getMainKeyImpactIndicators(keyImpactIndicatorsList)}
      evaluationPeriod={20}
    />
  );
}

export default DemoProjectImpactsOnboarding;
