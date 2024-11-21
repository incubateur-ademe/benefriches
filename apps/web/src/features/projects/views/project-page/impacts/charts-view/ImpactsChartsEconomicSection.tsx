import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { SocioEconomicImpactByActor } from "@/features/projects/domain/projectImpactsSocioEconomic";

import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import EconomicBalanceChartCard from "./impacts/economic-balance/EconomicBalanceChartCard";
import SocioEconomicImpactsChartCard from "./impacts/socio-economic/SocioEconomicImpactsChartCard";

type Props = {
  economicBalance: EconomicBalance;
  socioEconomicImpacts: SocioEconomicImpactByActor;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsChartsEconomicSection = ({
  economicBalance,
  socioEconomicImpacts,
  openImpactDescriptionModal,
}: Props) => {
  const displayEconomicBalance = economicBalance.economicBalance.length > 0;

  return (
    <div className="tw-grid lg:tw-grid-cols-3 tw-gap-10 tw-mb-8">
      {displayEconomicBalance && (
        <div className="lg:tw-col-start-1">
          <EconomicBalanceChartCard
            economicBalance={economicBalance["economicBalance"]}
            bearer={economicBalance["bearer"]}
            onClick={() => {
              openImpactDescriptionModal("economic-balance");
            }}
          />
        </div>
      )}

      <div
        className={
          displayEconomicBalance
            ? "lg:tw-col-start-2 lg:tw-col-end-4"
            : "lg:tw-col-start-1 lg:tw-col-end-3"
        }
      >
        <SocioEconomicImpactsChartCard
          socioEconomicImpacts={socioEconomicImpacts}
          onClick={() => {
            openImpactDescriptionModal("socio-economic");
          }}
        />
      </div>
    </div>
  );
};

export default ImpactsChartsEconomicSection;
