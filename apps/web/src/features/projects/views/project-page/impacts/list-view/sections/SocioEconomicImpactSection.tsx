import React from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { SocioEconomicImpactsByBearerListView } from "@/features/projects/core/projectImpactsSocioEconomic";

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
        {impacts[sectionName].impacts.map(({ keyName, total, ...rest }) => (
          <React.Fragment key={`wrapper-${keyName}`}>
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-socioeconomic-${sectionName}-${keyName}-List`}
              initialState={{
                sectionName: "socio_economic",
                subSectionName: sectionName,
                impactName: keyName,
              }}
              {...modalData}
            />
            <ImpactItemGroup isClickable key={`group-${keyName}`}>
              <ImpactItemDetails
                value={total}
                label={getSocioEconomicImpactLabel(keyName)}
                actor={"bearerName" in rest ? rest.bearerName : undefined}
                data={
                  "details" in rest
                    ? rest.details.map((item) => ({
                        label: getSocioEconomicImpactLabel(item.keyName),
                        value: item.total,
                        labelProps: getDialogControlButtonProps(
                          `fr-modal-impacts-socioeconomic-${sectionName}-${keyName}-${item.keyName}-List`,
                        ),
                      }))
                    : undefined
                }
                type="monetary"
                labelProps={getDialogControlButtonProps(
                  `fr-modal-impacts-socioeconomic-${sectionName}-${keyName}-List`,
                )}
              />
              {"details" in rest &&
                rest.details.map(({ keyName: detailsName }) => (
                  <ImpactModalDescription
                    key={detailsName}
                    dialogId={`fr-modal-impacts-socioeconomic-${sectionName}-${keyName}-${detailsName}-List`}
                    initialState={{
                      sectionName: "socio_economic",
                      subSectionName: sectionName,
                      impactName: keyName,
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
