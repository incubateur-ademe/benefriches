import { fr } from "@codegouvfr/react-dsfr";
import { ImpactDescriptionModalCategory } from "./../modals/ImpactDescriptionModalWizard";
import CostBenefitAnalysisCard from "./impacts/cost-benefit-analysis/CostBenefitAnalysisCard";
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
    <section className={fr.cx("fr-pb-8v")}>
      <h3>Impacts économiques</h3>
      <div
        className={
          displayEconomicBalance
            ? "tw-grid tw-grid-rows-1 lg:tw-grid-rows-2 tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4"
            : "tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4"
        }
      >
        {displayEconomicBalance && (
          <>
            <div className="lg:tw-row-start-1 lg:tw-row-end-3">
              <CostBenefitAnalysisCard
                economicBalanceTotal={economicBalance.total}
                socioEconomicImpactsTotal={socioEconomicImpacts.total}
                economicBalanceBearer={economicBalance.bearer}
                onClick={() => {
                  openImpactDescriptionModal("cost-benefit-analysis");
                }}
              />
            </div>
            <div className="lg:tw-row-start-1">
              <EconomicBalanceImpactCard
                economicBalance={economicBalance["economicBalance"]}
                bearer={economicBalance["bearer"]}
                onClick={() => {
                  openImpactDescriptionModal("economic-balance");
                }}
              />
            </div>
          </>
        )}

        <div className={displayEconomicBalance ? "lg:tw-row-start-2" : "lg: tw-row-start-1"}>
          <SocioEconomicImpactsCard
            socioEconomicImpacts={socioEconomicImpacts}
            onClick={() => {
              openImpactDescriptionModal("socio-economic");
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ImpactsChartsEconomicSection;
