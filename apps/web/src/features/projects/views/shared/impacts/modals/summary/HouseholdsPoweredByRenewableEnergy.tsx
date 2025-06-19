import { useContext } from "react";

import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import ImpactItemDetails from "../../../../project-page/impacts/list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../../project-page/impacts/list-view/ImpactItemGroup";

type Props = {
  impactData: {
    value: number;
  };
};

const SummaryHouseholdsPoweredByRenewableEnergyDescription = ({ impactData }: Props) => {
  const { value } = impactData;
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  return (
    <ModalBody>
      <ModalHeader
        title="+ d’énergies renouvelables&nbsp;⚡"
        value={{
          text: formatNumberFr(value),
          state: "success",
          description: `nouveaux foyers alimentés en EnR`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: "+ d’énergies renouvelables" }]}
      />
      <ModalContent noTitle>
        <p>
          Il s'agit d'une illustration du potentiel de production en électricité renouvelable qui
          sera produite par la centrale du projet en nombre de foyers alimentés.
        </p>
        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={value}
            label="🏠 Foyers alimentés par les EnR"
            type="default"
            labelProps={{
              onClick: (e) => {
                e.stopPropagation();
                updateModalContent({
                  sectionName: "social",
                  impactName: "households_powered_by_renewable_energy",
                });
              },
            }}
          />
        </ImpactItemGroup>
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryHouseholdsPoweredByRenewableEnergyDescription;
