import { SiteNature } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectAvoidedInactionCostsAnalysisDataView } from "@/features/projects/application/project-impacts/selectors/projectAvoidedCostsAnalysis.selectors";
import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";

import ProjectAvoidedInactionCosts from "./ProjectAvoidedInactionCosts";

type Props = {
  projectType: ProjectDevelopmentPlanType;
  siteNature: SiteNature;
};

export default function ProjectAvoidedInactionCostsContainer({ projectType, siteNature }: Props) {
  const {
    projectOnSiteIndirectEconomicImpactsByBearerAndCategory,
    siteStatuQuoIndirectEconomicImpactsByBearerAndCategory,
    projectEconomicBalance,
  } = useAppSelector(selectAvoidedInactionCostsAnalysisDataView);

  if (
    !projectEconomicBalance ||
    !projectOnSiteIndirectEconomicImpactsByBearerAndCategory ||
    !siteStatuQuoIndirectEconomicImpactsByBearerAndCategory
  ) {
    return null;
  }

  return (
    <ProjectAvoidedInactionCosts
      projectType={projectType}
      siteNature={siteNature}
      projectEconomicBalance={projectEconomicBalance}
      projectImpactsByBearerAndCategory={projectOnSiteIndirectEconomicImpactsByBearerAndCategory}
      siteStatuQuoImpactsByBearerAndCategory={
        siteStatuQuoIndirectEconomicImpactsByBearerAndCategory
      }
    />
  );
}
