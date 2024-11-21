import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { SocioEconomicImpactByActor } from "@/features/projects/domain/projectImpactsSocioEconomic";

import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import CostBenefitAnalysisChartCard from "./impacts/cost-benefit-analysis/CostBenefitAnalysisChartCard";
import EconomicBalanceChartCard from "./impacts/economic-balance/EconomicBalanceChartCard";
import SocioEconomicImpactsChartCard from "./impacts/socio-economic/SocioEconomicImpactsChartCard";

type Props = {
  economicBalance: EconomicBalance;
  socioEconomicTotalImpact: number;
  socioEconomicImpactsByActor: SocioEconomicImpactByActor;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsChartsEconomicSection = ({
  economicBalance,
  socioEconomicTotalImpact,
  socioEconomicImpactsByActor,
  openImpactDescriptionModal,
}: Props) => {
  const displayEconomicBalance = economicBalance.economicBalance.length > 0;

  return (
    <div className="tw-grid md:tw-grid-cols-2 tw-gap-10 tw-mb-8">
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
          onClick={() => {
            openImpactDescriptionModal("economic-balance");
          }}
        />
      )}

      <SocioEconomicImpactsChartCard
        socioEconomicImpacts={socioEconomicImpactsByActor}
        onClick={() => {
          openImpactDescriptionModal("socio-economic");
        }}
      />
    </div>
  );
};

export default ImpactsChartsEconomicSection;
