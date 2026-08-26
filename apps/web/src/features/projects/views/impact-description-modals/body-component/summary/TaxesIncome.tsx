import { useContext } from "react";

import type { KeyImpactIndicatorData } from "@/features/projects/core/projectKeyImpactIndicators";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import ImpactItemDetails from "../../../project-impacts/list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../project-impacts/list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalBody from "../../modal-layout/ModalBody";
import ModalContent from "../../modal-layout/ModalContent";
import ModalHeader from "../../modal-layout/ModalHeader";

type Props = {
  impactData: Extract<KeyImpactIndicatorData, { name: "taxesIncomesImpact" }>;
};

const SummaryTaxesIncomeDescription = ({ impactData }: Props) => {
  const { isSuccess, value } = impactData;
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  const title = isSuccess ? `+ de recettes fiscales\u00a0💰` : `- de recettes fiscales\u00a0💸`;

  return (
    <ModalBody>
      <ModalHeader
        title={title}
        value={{
          text: formatMonetaryImpact(value),
          state: isSuccess ? "success" : "error",
          description: isSuccess
            ? `à venir au profit notamment de la collectivité`
            : `en moins pour, notamment, la collectivité`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]}
      />
      <ModalContent noTitle>
        <p>
          La concrétisation du projet va générer des recettes fiscales pour la collectivité
          (exemples : taxe foncière sur les propriétés bâties, cotisation foncière des entreprises).
        </p>
        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={value}
            label="🏛️ Recettes fiscales"
            type="monetary"
            labelProps={getDetailsLink({
              sectionName: "socioEconomic.localAuthority",
              impactDetailsName: "taxesIncome",
            })}
          />
        </ImpactItemGroup>
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryTaxesIncomeDescription;
