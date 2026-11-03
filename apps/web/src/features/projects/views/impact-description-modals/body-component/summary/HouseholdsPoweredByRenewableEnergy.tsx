import { useContext } from "react";
import type { KeyImpactIndicatorData } from "shared";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import ImpactItemDetails from "../../../project-impacts/list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../project-impacts/list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalBody from "../../modal-layout/ModalBody";
import ModalContent from "../../modal-layout/ModalContent";
import ModalHeader from "../../modal-layout/ModalHeader";

type Props = {
  impactData: Extract<KeyImpactIndicatorData, { name: "householdsPoweredByRenewableEnergy" }>;
};

const SummaryHouseholdsPoweredByRenewableEnergyDescription = ({ impactData }: Props) => {
  const { value } = impactData;
  const { getDetailsLink, onCloseLink } = useContext(ImpactModalDescriptionContext);

  return (
    <ModalBody>
      <ModalHeader
        onCloseLink={onCloseLink}
        exportProps={false}
        dataProps={{
          type: "value",
          headerProps: {
            value: {
              text: formatNumberFr(value),
              state: "success",
              description: `nouveaux foyers alimentés en EnR`,
            },
          },
        }}

        breadcrumbSegments={[{ label: "Synthèse" }, { label: "+ d’énergies renouvelables" }]}
      >
        + d’énergies renouvelables&nbsp;⚡
      </ModalHeader>
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
