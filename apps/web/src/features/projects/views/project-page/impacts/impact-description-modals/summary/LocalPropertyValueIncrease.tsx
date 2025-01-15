import { useContext } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

type Props = {
  impactData: {
    value: number;
  };
};

const SummaryLocalPropertyValueIncreaseDescription = ({ impactData }: Props) => {
  const { value } = impactData;
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <>
      <ModalHeader
        title="Un cadre de vie amélioré&nbsp;🏡"
        value={{
          text: formatMonetaryImpact(value),
          state: "success",
          description: `de valeur patrimoniale attendue par la reconversion de la friche`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: "Un cadre de vie amélioré" }]}
      />
      <ModalContent>
        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={value}
            label="🏡 Valeur patrimoniale des bâtiments alentour"
            type="default"
            onClick={() => {
              openImpactModalDescription({
                sectionName: "socio_economic",
                impactName: "local_property_value_increase",
              });
            }}
          />
        </ImpactItemGroup>
      </ModalContent>
    </>
  );
};

export default SummaryLocalPropertyValueIncreaseDescription;
