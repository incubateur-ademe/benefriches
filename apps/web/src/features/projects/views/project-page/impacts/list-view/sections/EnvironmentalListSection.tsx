import { typedObjectEntries } from "shared";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import {
  EnvironmentalImpactMetricMainKeyName,
  EnvironmentalImpactMetricsByListViewCategory,
} from "@/features/projects/core/projectImpactsEnvironmental";

import { getEnvironmentalImpactLabel } from "../../getImpactLabel";
import ImpactModalDescription from "../../impact-description-modals/ImpactModalDescription";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";
import { getDialogControlButtonProps } from "../dialogControlBtnProps";

type Props = {
  impacts: EnvironmentalImpactMetricsByListViewCategory;
  modalData: ModalDataProps;
};

const getValueType = (name: EnvironmentalImpactMetricMainKeyName) => {
  switch (name) {
    case "avoidedCo2eqEmissions":
      return "co2";
    case "newPermeableSurface":
    case "nonContaminatedSurfaceArea":
      return "surface_area";
  }
};

const getSectionTitle = (name: keyof EnvironmentalImpactMetricsByListViewCategory) => {
  switch (name) {
    case "co2eq":
      return "Impacts sur le CO2-eq";
    case "soils":
      return "Impacts sur  les sols";
  }
};

const EnvironmentalListSection = ({ impacts, modalData }: Props) => {
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
        {typedObjectEntries(impacts).map(([group, list]) =>
          list.length > 0 ? (
            <>
              <ImpactModalDescription
                dialogId={`fr-modal-impacts-environmental-${group}-Chart`}
                initialState={{
                  sectionName: "environmental",
                  subSectionName: group,
                }}
                {...modalData}
              />
              <ImpactSection
                title={getSectionTitle(group)}
                dialogId={`fr-modal-impacts-environmental-${group}-Chart`}
              >
                {list.map(({ keyName, total, ...rest }) => (
                  <ImpactItemGroup key={keyName} isClickable>
                    <ImpactModalDescription
                      dialogId={`fr-modal-impacts-environmental-${group}-${keyName}-Chart`}
                      initialState={{
                        sectionName: "environmental",
                        subSectionName: group,
                        impactName: keyName,
                      }}
                      {...modalData}
                    />
                    <ImpactItemDetails
                      label={getEnvironmentalImpactLabel(keyName)}
                      value={total}
                      labelProps={getDialogControlButtonProps(
                        `fr-modal-impacts-environmental-${group}-${keyName}-Chart`,
                      )}
                      data={
                        "details" in rest
                          ? rest.details.map((item) => ({
                              label: getEnvironmentalImpactLabel(item.keyName),
                              value: item.total,
                              labelProps: getDialogControlButtonProps(
                                `fr-modal-impacts-environmental-${group}-${keyName}-${item.keyName}-Chart`,
                              ),
                            }))
                          : undefined
                      }
                      type={getValueType(keyName)}
                    />
                    {"details" in rest &&
                      rest.details.map(({ keyName: detailsName }) => (
                        <ImpactModalDescription
                          key={detailsName}
                          dialogId={`fr-modal-impacts-environmental-${group}-${keyName}-${detailsName}-Chart`}
                          initialState={{
                            sectionName: "environmental",
                            subSectionName: group,
                            impactName: keyName,
                            impactDetailsName: detailsName,
                          }}
                          {...modalData}
                        />
                      ))}
                  </ImpactItemGroup>
                ))}
              </ImpactSection>
            </>
          ) : null,
        )}
      </ImpactSection>
    </>
  );
};

export default EnvironmentalListSection;
