import { SiteNature } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectAvoidedInactionCostsAnalysisDataView } from "@/features/projects/application/project-impacts/projectAvoidedCostsAnalysis.selectors";
import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";

import ProjectAvoidedInactionCosts from "./ProjectAvoidedInactionCosts";

type Props = {
  projectType: ProjectDevelopmentPlanType;
  siteNature: SiteNature;
};

export default function ProjectAvoidedInactionCostsContainer({ projectType, siteNature }: Props) {
  const {
    projectOnSiteIndirectEconomicImpactsData,
    siteStatuQuoIndirectEconomicImpactsData,
    stakeholders,
    projectEconomicBalance,
  } = useAppSelector(selectAvoidedInactionCostsAnalysisDataView);

  if (
    !projectEconomicBalance ||
    !projectOnSiteIndirectEconomicImpactsData ||
    !siteStatuQuoIndirectEconomicImpactsData ||
    !stakeholders
  ) {
    return null;
  }

  return (
    <ProjectAvoidedInactionCosts
      projectType={projectType}
      siteNature={siteNature}
      projectEconomicBalance={projectEconomicBalance}
      projectImpacts={projectOnSiteIndirectEconomicImpactsData}
      siteStatuQuoImpacts={siteStatuQuoIndirectEconomicImpactsData}
      stakeholders={stakeholders}
    />
  );
}
