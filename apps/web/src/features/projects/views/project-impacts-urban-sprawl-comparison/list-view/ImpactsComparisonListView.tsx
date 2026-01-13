import { DevelopmentPlanType, SiteNature, UrbanSprawlComparisonImpacts } from "shared";

import TableHeaderRow from "./layout/TableHeaderRow";
import ImpactComparisonTableSeparatorRow from "./layout/TableSeparatorRow";
import ImpactComparisonListEconomicBalanceSection from "./sections/EconomicBalanceSection";
import ImpactComparisonEnvironmentalSection from "./sections/EnvironmentalSection";
import ImpactComparisonListSocialSection from "./sections/SocialSection";
import ImpactComparisonListSocioEconomicSection from "./sections/SocioEconomicSection";

type Props = {
  baseCase: {
    impacts: UrbanSprawlComparisonImpacts;
    siteNature: SiteNature;
  };
  comparisonCase: {
    impacts: UrbanSprawlComparisonImpacts;
    siteNature: SiteNature;
  };
  projectType: DevelopmentPlanType;
};

const ImpactComparisonListView = ({ baseCase, comparisonCase, projectType }: Props) => {
  return (
    <div>
      <table className="w-full" cellSpacing="0" cellPadding="0">
        <thead>
          <TableHeaderRow
            baseCaseSiteNature={baseCase.siteNature}
            comparisonCaseSiteNature={comparisonCase.siteNature}
          />
        </thead>
        <tbody>
          <ImpactComparisonTableSeparatorRow size="large" />

          <ImpactComparisonListEconomicBalanceSection
            projectType={projectType}
            baseCase={baseCase}
            comparisonCase={comparisonCase}
          />
          <ImpactComparisonListSocioEconomicSection
            baseCase={baseCase}
            comparisonCase={comparisonCase}
          />
          <ImpactComparisonListSocialSection baseCase={baseCase} comparisonCase={comparisonCase} />
          <ImpactComparisonEnvironmentalSection
            baseCase={baseCase}
            comparisonCase={comparisonCase}
          />
        </tbody>
      </table>
    </div>
  );
};

export default ImpactComparisonListView;
