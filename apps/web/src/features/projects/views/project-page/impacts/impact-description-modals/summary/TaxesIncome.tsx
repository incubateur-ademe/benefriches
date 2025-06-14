import { useContext } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

type Props = {
  impactData: {
    value: number;
    isSuccess: boolean;
  };
};

const SummaryTaxesIncomeDescription = ({ impactData }: Props) => {
  const { isSuccess, value } = impactData;
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

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
            label="🏛 Recettes fiscales"
            type="monetary"
            labelProps={{
              onClick: (e) => {
                e.stopPropagation();
                updateModalContent({
                  sectionName: "socio_economic",
                  impactName: "taxes_income",
                });
              },
            }}
          />
        </ImpactItemGroup>
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryTaxesIncomeDescription;
