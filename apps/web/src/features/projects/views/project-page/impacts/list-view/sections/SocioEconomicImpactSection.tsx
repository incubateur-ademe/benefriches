import React from "react";

import { SocioEconomicImpactByCategory } from "@/features/projects/domain/projectImpactsSocioEconomic";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ImpactModalDescription, {
  ModalDataProps,
} from "../../impact-description-modals/ImpactModalDescription";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";
import { getDialogControlButtonProps } from "../dialogControlBtnProps";

type Props = SocioEconomicImpactByCategory & {
  sectionName:
    | "economic_direct"
    | "economic_indirect"
    | "social_monetary"
    | "environmental_monetary";
  initialShowSectionContent?: boolean;
  noMarginBottom?: boolean;
  modalData: ModalDataProps;
};

const getSectionTitle = (sectionName: Props["sectionName"]) => {
  switch (sectionName) {
    case "economic_direct":
      return "Impacts économiques directs";
    case "economic_indirect":
      return "Impacts économiques indirects";
    case "social_monetary":
      return "Impacts sociaux monétarisés";
    case "environmental_monetary":
      return "Impacts environnementaux monétarisés";
  }
};
const SocioEconomicImpactSection = ({
  impacts,
  total,
  sectionName,
  modalData,
  ...props
}: Props) => {
  if (impacts.length === 0) {
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
        total={total}
        {...props}
        dialogId={`fr-modal-impacts-socioeconomic-${sectionName}-List`}
      >
        {impacts.map(({ name, actors }) => (
          <React.Fragment key={name}>
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-socioeconomic-${sectionName}-${name}-List`}
              initialState={{
                sectionName: "socio_economic",
                subSectionName: sectionName,
                impactName: name,
              }}
              {...modalData}
            />
            <ImpactActorsItem
              type="monetary"
              label={getSocioEconomicImpactLabel(name)}
              labelProps={getDialogControlButtonProps(
                `fr-modal-impacts-socioeconomic-${sectionName}-${name}-List`,
              )}
              actors={actors.map(
                ({ name: actorLabel, value: actorValue, details: actorDetails }) => ({
                  label: getActorLabel(actorLabel),
                  value: actorValue,
                  details: actorDetails
                    ? actorDetails.map(({ name: detailsName, value: detailsValue }) => ({
                        label: getSocioEconomicImpactLabel(detailsName),
                        value: detailsValue,
                        labelProps: getDialogControlButtonProps(
                          `fr-modal-impacts-socioeconomic-${sectionName}-${name}-${detailsName}-List`,
                        ),
                      }))
                    : undefined,
                }),
              )}
            />
            {actors.map(({ details = [] }) =>
              details.map(({ name: detailsName }) => (
                <ImpactModalDescription
                  key={detailsName}
                  dialogId={`fr-modal-impacts-socioeconomic-${sectionName}-${name}-${detailsName}-List`}
                  initialState={{
                    sectionName: "socio_economic",
                    impactName: name,
                    impactDetailsName: detailsName,
                  }}
                  {...modalData}
                />
              )),
            )}
          </React.Fragment>
        ))}
      </ImpactSection>
    </>
  );
};

export default SocioEconomicImpactSection;
