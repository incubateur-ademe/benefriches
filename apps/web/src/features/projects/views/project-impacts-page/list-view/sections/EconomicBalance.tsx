import ImpactItemRow from "../ImpactItemRow";
import ImpactLabel from "../ImpactLabel";
import ImpactMainTitle from "../ImpactMainTitle";
import ImpactValue from "../ImpactValue";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-impacts-page/modals/ImpactDescriptionModalWizard";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  impact: ReconversionProjectImpacts["economicBalance"];
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const EconomicBalanceListSection = ({ impact, openImpactDescriptionModal }: Props) => {
  return (
    <section className="fr-mb-5w">
      <ImpactMainTitle
        title="Bilan de l'opération"
        onClick={() => {
          openImpactDescriptionModal("economic-balance");
        }}
      />
      {!!impact.costs.realEstateTransaction && (
        <ImpactItemRow
          onClick={() => {
            openImpactDescriptionModal("economic-balance-real-estate-acquisition");
          }}
        >
          <ImpactLabel>🏠 Acquisition du site</ImpactLabel>
          <ImpactValue>{formatMonetaryImpact(impact.costs.realEstateTransaction)}</ImpactValue>
        </ImpactItemRow>
      )}
      {!!impact.costs.siteReinstatement && (
        <ImpactItemRow>
          <ImpactLabel>🏗 Remise en état de la friche</ImpactLabel>
          <ImpactValue>{formatMonetaryImpact(impact.costs.siteReinstatement)}</ImpactValue>
        </ImpactItemRow>
      )}
      {!!impact.costs.developmentPlanInstallation && (
        <ImpactItemRow>
          <ImpactLabel>⚡️ Installation des panneaux photovoltaïques</ImpactLabel>
          <ImpactValue>
            {formatMonetaryImpact(impact.costs.developmentPlanInstallation)}
          </ImpactValue>
        </ImpactItemRow>
      )}
      {!!impact.revenues.financialAssistance && (
        <ImpactItemRow>
          <ImpactLabel>🏦 Aides financières</ImpactLabel>
          <ImpactValue>{formatMonetaryImpact(impact.revenues.financialAssistance)}</ImpactValue>
        </ImpactItemRow>
      )}
      <ImpactItemRow>
        <ImpactLabel>💸️ Charges d'exploitation</ImpactLabel>
        <ImpactValue>{formatMonetaryImpact(impact.costs.operationsCosts.total)}</ImpactValue>
      </ImpactItemRow>
      <ImpactItemRow>
        <ImpactLabel>💰 Recettes d'exploitation</ImpactLabel>
        <ImpactValue>{formatMonetaryImpact(impact.revenues.operationsRevenues.total)}</ImpactValue>
      </ImpactItemRow>
      <ImpactItemRow>
        <ImpactLabel>Total du bilan de l'opération</ImpactLabel>
        <ImpactValue isTotal>{formatMonetaryImpact(impact.total)}</ImpactValue>
      </ImpactItemRow>
    </section>
  );
};

export default EconomicBalanceListSection;
