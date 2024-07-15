import ImpactActorsItem from "../ImpactActorsItem";
import ImpactMainTitle from "../ImpactMainTitle";

import { EconomicBalance } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { SocioEconomicDetailedImpact } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-page/impacts/modals/ImpactDescriptionModalWizard";

type Props = {
  socioEconomicImpactTotal: SocioEconomicDetailedImpact["total"];
  economicBalanceImpactTotal: EconomicBalance["total"];
  economicBalanceBearer?: string;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const CostBenefitAnalysisListSection = ({
  socioEconomicImpactTotal,
  economicBalanceBearer,
  economicBalanceImpactTotal,
  openImpactDescriptionModal,
}: Props) => {
  return (
    <section className="fr-mb-5w">
      <ImpactMainTitle
        title="Analyse coûts bénéfices"
        onClick={() => {
          openImpactDescriptionModal("cost-benefit-analysis");
        }}
      />
      {economicBalanceImpactTotal !== 0 && (
        <ImpactActorsItem
          label="📉 Bilan de l'opération"
          onClick={() => {
            openImpactDescriptionModal("economic-balance");
          }}
          actors={[
            {
              label: economicBalanceBearer ?? "Aménageur",
              value: economicBalanceImpactTotal,
            },
          ]}
          type="monetary"
        />
      )}

      <ImpactActorsItem
        label="🌎 Impacts socio-économiques"
        onClick={() => {
          openImpactDescriptionModal("socio-economic");
        }}
        actors={[
          {
            label: "Bien commun",
            value: socioEconomicImpactTotal,
          },
        ]}
        type="monetary"
      />
    </section>
  );
};

export default CostBenefitAnalysisListSection;
