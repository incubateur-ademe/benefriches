import React from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { SocioEconomicImpactsByBearerListView } from "@/features/projects/domain/projectImpactsSocioEconomic";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ImpactModalDescription from "../../impact-description-modals/ImpactModalDescription";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";
import { getDialogControlButtonProps } from "../dialogControlBtnProps";

type Props = {
  impacts: SocioEconomicImpactsByBearerListView;
  sectionName: "humanity" | "localPeopleOrCompany" | "localAuthority";
  initialShowSectionContent?: boolean;
  noMarginBottom?: boolean;
  modalData: ModalDataProps;
};

const getSectionTitle = (sectionName: Props["sectionName"]) => {
  switch (sectionName) {
    case "humanity":
      return "Impacts économiques pour la société française et mondiale";
    case "localPeopleOrCompany":
      return "Impacts économiques pour les riverains";
    case "localAuthority":
      return "Impacts économiques pour la collectivité locale";
  }
};
const SocioEconomicImpactSection = ({ impacts, sectionName, modalData, ...props }: Props) => {
  if (impacts[sectionName].impacts.length === 0) {
    return null;
  }

  return (
    <>
      <ImpactModalDescription
        dialogId={`fr-modal-impacts-socioeconomic-${sectionName}-List`}
        initialState={{
          sectionName: "socio_economic",
          subSectionName: sectionName,
        }}
        {...modalData}
      />
      <ImpactSection
        title={getSectionTitle(sectionName)}
        total={impacts[sectionName].total}
        {...props}
        dialogId={`fr-modal-impacts-socioeconomic-${sectionName}-List`}
      >
        {impacts[sectionName].impacts.map(({ name, amount, details = [], bearerName }) => (
          <React.Fragment key={`wrapper-${name}`}>
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-socioeconomic-${sectionName}-${name}-List`}
              initialState={{
                sectionName: "socio_economic",
                subSectionName: sectionName,
                impactName: name,
              }}
              {...modalData}
            />
            <ImpactItemGroup isClickable key={`group-${name}`}>
              <ImpactItemDetails
                value={amount}
                label={getSocioEconomicImpactLabel(name)}
                actor={bearerName}
                data={details.map((item) => ({
                  label: getSocioEconomicImpactLabel(item.name),
                  value: item.amount,
                  labelProps: getDialogControlButtonProps(
                    `fr-modal-impacts-socioeconomic-${sectionName}-${name}-${item.name}-List`,
                  ),
                }))}
                type="monetary"
                labelProps={getDialogControlButtonProps(
                  `fr-modal-impacts-socioeconomic-${sectionName}-${name}-List`,
                )}
              />
              {details.map(({ name: detailsName }) => (
                <ImpactModalDescription
                  key={detailsName}
                  dialogId={`fr-modal-impacts-socioeconomic-${sectionName}-${name}-${detailsName}-List`}
                  initialState={{
                    sectionName: "socio_economic",
                    subSectionName: sectionName,
                    impactName: name,
                    impactDetailsName: detailsName,
                  }}
                  {...modalData}
                />
              ))}
            </ImpactItemGroup>
          </React.Fragment>
        ))}
      </ImpactSection>
    </>
  );
};

export default SocioEconomicImpactSection;
