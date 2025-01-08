import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { SocioEconomicImpactByActor } from "@/features/projects/domain/projectImpactsSocioEconomic";

import CostBenefitAnalysisChartCard from "./impacts/cost-benefit-analysis/CostBenefitAnalysisChartCard";
import EconomicBalanceChartCard from "./impacts/economic-balance/EconomicBalanceChartCard";
import SocioEconomicImpactsChartCard from "./impacts/socio-economic/SocioEconomicImpactsChartCard";

type Props = {
  economicBalance: EconomicBalance;
  socioEconomicTotalImpact: number;
  socioEconomicImpactsByActor: SocioEconomicImpactByActor;
};

const ImpactsChartsEconomicSection = ({
  economicBalance,
  socioEconomicTotalImpact,
  socioEconomicImpactsByActor,
}: Props) => {
  const displayEconomicBalance = economicBalance.economicBalance.length > 0;

  return (
    <>
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8 tw-mb-8">
        {displayEconomicBalance && (
          <CostBenefitAnalysisChartCard
            economicBalanceTotal={economicBalance.total}
            socioEconomicTotalImpact={socioEconomicTotalImpact}
          />
        )}
        {displayEconomicBalance && (
          <EconomicBalanceChartCard
            economicBalance={economicBalance["economicBalance"]}
            bearer={economicBalance["bearer"]}
          />
        )}
      </div>
      <SocioEconomicImpactsChartCard socioEconomicImpacts={socioEconomicImpactsByActor} />
    </>
  );
};

export default ImpactsChartsEconomicSection;
