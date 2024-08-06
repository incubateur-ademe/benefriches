import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import EconomicBalanceImpactCard from "./impacts/economic-balance/EconomicBalanceImpactCard";
import SocioEconomicImpactsCard from "./impacts/socio-economic/SocioEconomicImpactsCard";

import { EconomicBalance } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { SocioEconomicImpactByActorAndCategory } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";

type Props = {
  economicBalance: EconomicBalance;
  socioEconomicImpacts: SocioEconomicImpactByActorAndCategory;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsChartsEconomicSection = ({
  economicBalance,
  socioEconomicImpacts,
  openImpactDescriptionModal,
}: Props) => {
  const displayEconomicBalance = economicBalance.economicBalance.length > 0;

  return (
    <div className={"tw-grid tw-grid-rows-1 lg:tw-grid-cols-3 tw-gap-10 tw-mb-8"}>
      {displayEconomicBalance && (
        <div className="lg:tw-col-start-1">
          <EconomicBalanceImpactCard
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
        <SocioEconomicImpactsCard
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
