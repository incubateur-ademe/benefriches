import { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";

import {
  getEnvironmentalDetailsImpactLabel,
  getEnvironmentalImpactLabel,
} from "../../getImpactLabel";
import ImpactModalDescription, {
  ModalDataProps,
} from "../../impact-description-modals/ImpactModalDescription";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";
import { getDialogControlButtonProps } from "../dialogControlBtnProps";

type Props = {
  impacts: EnvironmentalImpact[];
  modalData: ModalDataProps;
};

const ENVIRONMENTAL_SECTIONS = {
  co2: ["co2_benefit"],
  soils: ["non_contaminated_surface_area", "permeable_surface_area"],
};

const EnvironmentalListSection = ({ impacts, modalData }: Props) => {
  const co2Impacts = impacts.filter(({ name }) => ENVIRONMENTAL_SECTIONS.co2.includes(name));
  const soilsImpacts = impacts.filter(({ name }) => ENVIRONMENTAL_SECTIONS.soils.includes(name));

  return (
    <>
      <ImpactModalDescription
        dialogId={`fr-modal-impacts-environmental-List`}
        initialState={{ sectionName: "environmental" }}
        {...modalData}
      />
      <ImpactSection
        isMain
        title="Impacts environnementaux"
        dialogId={`fr-modal-impacts-environmental-List`}
      >
        {co2Impacts.length > 0 && (
          <>
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-environmental-co2-List`}
              initialState={{
                sectionName: "environmental",
                subSectionName: "co2",
              }}
              {...modalData}
            />

            <ImpactSection
              title="Impacts sur le CO2-eq"
              dialogId={`fr-modal-impacts-environmental-co2-List`}
            >
              {co2Impacts.map(({ name, impact, type }) => (
                <ImpactItemGroup key={name} isClickable>
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts-environmental-co2-${name}-List`}
                    initialState={{
                      sectionName: "environmental",
                      subSectionName: "co2",
                      impactName: name,
                    }}
                    {...modalData}
                  />
                  <ImpactItemDetails
                    label={getEnvironmentalImpactLabel(name)}
                    value={impact.difference}
                    labelProps={getDialogControlButtonProps(
                      `fr-modal-impacts-environmental-co2-${name}-List`,
                    )}
                    data={
                      impact.details
                        ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                            label: getEnvironmentalDetailsImpactLabel(name, detailsName),
                            value: detailsImpact.difference,
                            labelProps: getDialogControlButtonProps(
                              `fr-modal-impacts-environmental-co2-${name}-${detailsName}-List`,
                            ),
                          }))
                        : undefined
                    }
                    type={type}
                  />
                  {(impact.details ?? []).map(({ name: detailsName }) => (
                    <ImpactModalDescription
                      key={detailsName}
                      dialogId={`fr-modal-impacts-environmental-co2-${name}-${detailsName}-List`}
                      initialState={{
                        sectionName: "environmental",
                        impactName: name,
                        impactDetailsName: detailsName,
                      }}
                      {...modalData}
                    />
                  ))}
                </ImpactItemGroup>
              ))}
            </ImpactSection>
          </>
        )}
        {soilsImpacts.length > 0 && (
          <>
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-environmental-soils-List`}
              initialState={{
                sectionName: "environmental",
                subSectionName: "soils",
              }}
              {...modalData}
            />
            <ImpactSection
              title="Impacts sur  les sols"
              dialogId="fr-modal-impacts-environmental-soils-List"
            >
              {soilsImpacts.map(({ name, impact, type }) => (
                <ImpactItemGroup key={name} isClickable>
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts-environmental-soils-${name}-List`}
                    initialState={{
                      sectionName: "environmental",
                      subSectionName: "soils",
                      impactName: name,
                    }}
                    {...modalData}
                  />
                  <ImpactItemDetails
                    label={getEnvironmentalImpactLabel(name)}
                    value={impact.difference}
                    labelProps={getDialogControlButtonProps(
                      `fr-modal-impacts-environmental-soils-${name}-List`,
                    )}
                    data={
                      impact.details
                        ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                            label: getEnvironmentalDetailsImpactLabel(name, detailsName),
                            value: detailsImpact.difference,
                            labelProps: getDialogControlButtonProps(
                              `fr-modal-impacts-environmental-soils-${name}-${detailsName}-List`,
                            ),
                          }))
                        : undefined
                    }
                    type={type}
                  />
                  {(impact.details ?? []).map(({ name: detailsName }) => (
                    <ImpactModalDescription
                      key={detailsName}
                      dialogId={`fr-modal-impacts-environmental-soils-${name}-${detailsName}-List`}
                      initialState={{
                        sectionName: "environmental",
                        impactName: name,
                        impactDetailsName: detailsName,
                      }}
                      {...modalData}
                    />
                  ))}
                </ImpactItemGroup>
              ))}
            </ImpactSection>
          </>
        )}
      </ImpactSection>
    </>
  );
};

export default EnvironmentalListSection;
