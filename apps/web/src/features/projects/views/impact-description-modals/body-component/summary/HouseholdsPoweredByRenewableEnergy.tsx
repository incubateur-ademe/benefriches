import { useContext } from "react";

import type { KeyImpactIndicatorData } from "@/features/projects/core/projectKeyImpactIndicators";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import ImpactItemDetails from "../../../project-page/impacts/list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../project-page/impacts/list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalBody from "../../modal-layout/ModalBody";
import ModalContent from "../../modal-layout/ModalContent";
import ModalHeader from "../../modal-layout/ModalHeader";

type Props = {
  impactData: Extract<KeyImpactIndicatorData, { name: "householdsPoweredByRenewableEnergy" }>;
};

const SummaryHouseholdsPoweredByRenewableEnergyDescription = ({ impactData }: Props) => {
  const { value } = impactData;
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

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
            labelProps={getDetailsLink({
              sectionName: "social.humanity",
              impactDetailsName: "householdsPoweredByRenewableEnergy",
            })}
          />
        </ImpactItemGroup>
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryHouseholdsPoweredByRenewableEnergyDescription;
