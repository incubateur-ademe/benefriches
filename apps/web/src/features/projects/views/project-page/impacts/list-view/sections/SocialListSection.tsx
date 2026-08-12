import { typedObjectEntries } from "shared";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import {
  SocialImpactMetricMainKeyName,
  SocialImpactMetricsByListViewCategory,
} from "@/features/projects/core/projectImpactsSocial";

import { getSocialImpactLabel } from "../../getImpactLabel";
import ImpactModalDescription from "../../impact-description-modals/ImpactModalDescription";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";
import { getDialogControlButtonProps } from "../dialogControlBtnProps";

type Props = {
  impacts: SocialImpactMetricsByListViewCategory;
  modalData: ModalDataProps;
};

const getValueType = (name: SocialImpactMetricMainKeyName) => {
  switch (name) {
    case "avoidedFricheAccidents":
    case "avoidedTrafficAccidents":
    case "avoidedVehiculeKilometers":
    case "householdsPoweredByRenewableEnergy":
      return "default";
    case "fullTimeJobs":
      return "etp";
    case "timeTravelSavedInHours":
      return "time";
  }
};

const getSectionTitle = (name: keyof SocialImpactMetricsByListViewCategory) => {
  switch (name) {
    case "humanity":
      return "Impacts sur la société française";
    case "localPeopleOrCompany":
      return "Impacts sur la population locale";
    case "jobs":
      return "Impacts sur l'emploi";
  }
};

const SocialListSection = ({ impacts, modalData }: Props) => {
  return (
    <>
      <ImpactModalDescription
        dialogId="fr-modal-impacts-social-Chart"
        initialState={{
          sectionName: "social",
        }}
        {...modalData}
      />

      <ImpactSection title="Impacts sociaux" isMain dialogId="fr-modal-impacts-social-Chart">
        {typedObjectEntries(impacts).map(([group, list]) =>
          list.length > 0 ? (
            <>
              <ImpactModalDescription
                dialogId={`fr-modal-impacts-social-${group}-Chart`}
                initialState={{
                  sectionName: "social",
                  subSectionName: group,
                }}
                {...modalData}
              />
              <ImpactSection
                title={getSectionTitle(group)}
                dialogId={`fr-modal-impacts-social-${group}-Chart`}
              >
                {list.map(({ keyName, total, ...rest }) => (
                  <ImpactItemGroup key={keyName} isClickable>
                    <ImpactModalDescription
                      dialogId={`fr-modal-impacts-social-${group}-${keyName}-Chart`}
                      initialState={{
                        sectionName: "social",
                        subSectionName: group,
                        impactName: keyName,
                      }}
                      {...modalData}
                    />
                    <ImpactItemDetails
                      label={getSocialImpactLabel(keyName)}
                      value={total}
                      labelProps={getDialogControlButtonProps(
                        `fr-modal-impacts-social-${group}-${keyName}-Chart`,
                      )}
                      data={
                        "details" in rest
                          ? rest.details.map((item) => ({
                              label: getSocialImpactLabel(item.keyName),
                              value: item.total,
                              labelProps: getDialogControlButtonProps(
                                `fr-modal-impacts-social-${group}-${keyName}-${item.keyName}-Chart`,
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
                          dialogId={`fr-modal-impacts-social-${group}-${keyName}-${detailsName}-Chart`}
                          initialState={{
                            sectionName: "social",
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

export default SocialListSection;
