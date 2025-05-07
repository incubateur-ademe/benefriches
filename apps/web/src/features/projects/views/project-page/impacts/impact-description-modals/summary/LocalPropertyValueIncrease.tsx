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
  };
};

const SummaryLocalPropertyValueIncreaseDescription = ({ impactData }: Props) => {
  const { value } = impactData;
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

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
            labelProps={{
              onClick: (e) => {
                e.stopPropagation();
                updateModalContent({
                  sectionName: "socio_economic",
                  impactName: "local_property_value_increase",
                });
              },
            }}
          />
        </ImpactItemGroup>
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryLocalPropertyValueIncreaseDescription;
