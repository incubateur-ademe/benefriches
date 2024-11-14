import { routes } from "@/app/views/router";
import { ReconversionProjectImpactsResult } from "@/features/projects/application/fetchReconversionProjectImpacts.action";
import {
  getKeyImpactIndicatorsList,
  getMainKeyImpactIndicators,
  getProjectOverallImpact,
} from "@/features/projects/domain/projectKeyImpactIndicators";
import ProjectImpactsOnboardingPage from "@/features/projects/views/project-impacts-onboarding/ProjectImpactsOnboardingPage";

type Props = {
  projectId: string;
  siteData: { name: string; id: string } & ReconversionProjectImpactsResult["siteData"];
  impactsData: ReconversionProjectImpactsResult["impacts"];
};

function DemoProjectImpactsOnboarding({ impactsData, siteData, projectId }: Props) {
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
