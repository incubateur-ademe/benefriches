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
  impactData: Extract<KeyImpactIndicatorData, { name: "localPropertyValueIncrease" }>;
};

const SummaryLocalPropertyValueIncreaseDescription = ({ impactData }: Props) => {
  const { value } = impactData;
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  return (
    <ModalBody>
      <ModalHeader
        title="Un cadre de vie amélioré&nbsp;🏡"
        value={{
          text: formatMonetaryImpact(value),
          state: "success",
          description: `de valeur patrimoniale attendue par la reconversion de la friche`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: "Un cadre de vie amélioré" }]}
      />
      <ModalContent noTitle>
        <p>
          La reconversion d’une friche urbaine, du fait de la transformation d’un espace plus ou
          moins ancien et dégradé, se traduit par une amélioration du cadre de vie des riverains du
          projet. La bibliographie met en évidence un effet positif de la suppression d’une friche
          sur la valeur patrimoniale des biens immobiliers pour les riverains.
        </p>
        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={value}
            label="🏡 Valeur patrimoniale des bâtiments alentour"
            type="monetary"
            labelProps={getDetailsLink({
              sectionName: "socioEconomic.localPeopleOrCompany",
              impactDetailsName: "localPropertyValueIncrease",
            })}
          />
        </ImpactItemGroup>
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryLocalPropertyValueIncreaseDescription;
