import ImpactDetailLabel from "../ImpactDetailLabel";
import ImpactDetailRow from "../ImpactItemDetailRow";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactItemRow from "../ImpactItemRow";
import ImpactLabel from "../ImpactLabel";
import ImpactMainTitle from "../ImpactMainTitle";
import ImpactValue from "../ImpactValue";

import {
  getLabelForPhotovoltaicInstallationCostPurpose,
  getLabelForReinstatementCostPurpose,
  ReinstatementCostsPurpose,
} from "@/features/create-project/domain/project.types";
import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-impacts-page/modals/ImpactDescriptionModalWizard";

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
          <ImpactValue value={-impact.costs.realEstateTransaction} type="monetary" />
        </ImpactItemRow>
      )}
      {!!impact.costs.siteReinstatement && (
        <ImpactItemGroup>
          <ImpactLabel>🚧 Remise en état de la friche</ImpactLabel>
          <ImpactDetailRow>
            <ImpactDetailLabel>{impact.bearer ?? "Aménageur"}</ImpactDetailLabel>
            <ImpactValue isTotal value={-impact.costs.siteReinstatement.total} type="monetary" />
          </ImpactDetailRow>
          {impact.costs.siteReinstatement.costs.map(({ amount, purpose }) => (
            <ImpactDetailRow key={purpose}>
              <ImpactDetailLabel>
                {getLabelForReinstatementCostPurpose(purpose as ReinstatementCostsPurpose)}
              </ImpactDetailLabel>
              <ImpactValue value={-amount} type="monetary" />
            </ImpactDetailRow>
          ))}
        </ImpactItemGroup>
      )}
      {!!impact.costs.developmentPlanInstallation && (
        <ImpactItemGroup>
          <ImpactLabel>⚡️ Installation des panneaux photovoltaïques</ImpactLabel>
          <ImpactDetailRow>
            <ImpactDetailLabel>{impact.bearer ?? "Aménageur"}</ImpactDetailLabel>
            <ImpactValue
              isTotal
              value={-impact.costs.developmentPlanInstallation.total}
              type="monetary"
            />
          </ImpactDetailRow>
          {impact.costs.developmentPlanInstallation.costs.map(({ amount, purpose }) => (
            <ImpactDetailRow key={purpose}>
              <ImpactDetailLabel>
                {getLabelForPhotovoltaicInstallationCostPurpose(purpose)}
              </ImpactDetailLabel>
              <ImpactValue value={-amount} type="monetary" />
            </ImpactDetailRow>
          ))}
        </ImpactItemGroup>
      )}
      {!!impact.revenues.financialAssistance && (
        <ImpactItemRow>
          <ImpactLabel>🏦 Aides financières</ImpactLabel>
          <ImpactValue value={impact.revenues.financialAssistance} type="monetary" />
        </ImpactItemRow>
      )}
      {!!impact.costs.operationsCosts && (
        <ImpactItemRow>
          <ImpactLabel>💸️ Charges d'exploitation</ImpactLabel>
          <ImpactValue value={-impact.costs.operationsCosts.total} type="monetary" />
        </ImpactItemRow>
      )}
      {!!impact.revenues.operationsRevenues && (
        <ImpactItemRow>
          <ImpactLabel>💰 Recettes d'exploitation</ImpactLabel>
          <ImpactValue value={impact.revenues.operationsRevenues.total} type="monetary" />
        </ImpactItemRow>
      )}

      <ImpactItemRow>
        <ImpactLabel>Total du bilan de l'opération</ImpactLabel>
        <ImpactValue isTotal value={impact.total} type="monetary" />
      </ImpactItemRow>
    </section>
  );
};

export default EconomicBalanceListSection;
