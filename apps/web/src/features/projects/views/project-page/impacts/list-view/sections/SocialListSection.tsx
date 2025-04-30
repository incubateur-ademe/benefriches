import { SocialImpact } from "@/features/projects/domain/projectImpactsSocial";

import { getSocialImpactLabel } from "../../getImpactLabel";
import ImpactModalDescription, {
  ModalDataProps,
} from "../../impact-description-modals/ImpactModalDescription";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";
import { getDialogControlButtonProps } from "../dialogControlBtnProps";

type Props = {
  impacts: SocialImpact[];
  modalData: ModalDataProps;
};

const SOCIAL_SECTIONS = {
  jobs: ["full_time_jobs"],
  residents: ["avoided_vehicule_kilometers", "travel_time_saved", "avoided_traffic_accidents"],
  french_society: ["avoided_friche_accidents", "households_powered_by_renewable_energy"],
};

const SocialListSection = ({ impacts, modalData }: Props) => {
  const jobsImpacts = impacts.filter(({ name }) => SOCIAL_SECTIONS.jobs.includes(name));
  const residentsImpacts = impacts.filter(({ name }) => SOCIAL_SECTIONS.residents.includes(name));
  const frenchSocietyImpacts = impacts.filter(({ name }) =>
    SOCIAL_SECTIONS.french_society.includes(name),
  );

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
        {jobsImpacts.length > 0 && (
          <>
            <ImpactModalDescription
              dialogId="fr-modal-impacts-social-jobs-Chart"
              initialState={{
                sectionName: "social",
                subSectionName: "jobs",
              }}
              {...modalData}
            />
            <ImpactSection
              title="Impacts sur l'emploi"
              dialogId="fr-modal-impacts-social-jobs-Chart"
            >
              {jobsImpacts.map(({ name, impact, type }) => (
                <ImpactItemGroup key={name} isClickable>
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts-social-jobs-${name}-Chart`}
                    initialState={{
                      sectionName: "social",
                      subSectionName: "jobs",
                      impactName: name,
                    }}
                    {...modalData}
                  />
                  <ImpactItemDetails
                    label={getSocialImpactLabel(name)}
                    value={impact.difference}
                    labelProps={getDialogControlButtonProps(
                      `fr-modal-impacts-social-jobs-${name}-Chart`,
                    )}
                    data={
                      impact.details
                        ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                            label: getSocialImpactLabel(detailsName),
                            value: detailsImpact.difference,
                            labelProps: getDialogControlButtonProps(
                              `fr-modal-impacts-social-jobs-${name}-${detailsName}-Chart`,
                            ),
                          }))
                        : undefined
                    }
                    type={type}
                  />
                  {(impact.details ?? []).map(({ name: detailsName }) => (
                    <ImpactModalDescription
                      key={detailsName}
                      dialogId={`fr-modal-impacts-social-jobs-${name}-${detailsName}-Chart`}
                      initialState={{
                        sectionName: "social",
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

        {residentsImpacts.length > 0 && (
          <>
            <ImpactModalDescription
              dialogId="fr-modal-impacts-social-local_people-Chart"
              initialState={{
                sectionName: "social",
                subSectionName: "local_people",
              }}
              {...modalData}
            />
            <ImpactSection
              title="Impacts sur la population locale"
              dialogId="fr-modal-impacts-social-local_people-Chart"
            >
              {residentsImpacts.map(({ name, impact, type }) => (
                <ImpactItemGroup key={name} isClickable>
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts-social-local_people-${name}-Chart`}
                    initialState={{
                      sectionName: "social",
                      subSectionName: "local_people",
                      impactName: name,
                    }}
                    {...modalData}
                  />
                  <ImpactItemDetails
                    label={getSocialImpactLabel(name)}
                    value={impact.difference}
                    labelProps={getDialogControlButtonProps(
                      `fr-modal-impacts-social-local_people-${name}-Chart`,
                    )}
                    data={
                      impact.details
                        ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                            label: getSocialImpactLabel(detailsName),
                            value: detailsImpact.difference,
                            labelProps: getDialogControlButtonProps(
                              `fr-modal-impacts-social-local_people-${name}-${detailsName}-Chart`,
                            ),
                          }))
                        : undefined
                    }
                    type={type}
                  />
                  {(impact.details ?? []).map(({ name: detailsName }) => (
                    <ImpactModalDescription
                      key={detailsName}
                      dialogId={`fr-modal-impacts-social-local_people-${name}-${detailsName}-Chart`}
                      initialState={{
                        sectionName: "social",
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

        {frenchSocietyImpacts.length > 0 && (
          <>
            <ImpactModalDescription
              dialogId="fr-modal-impacts-social-french_society-Chart"
              initialState={{
                sectionName: "social",
                subSectionName: "french_society",
              }}
              {...modalData}
            />
            <ImpactSection
              title="Impacts sur la société française"
              dialogId="fr-modal-impacts-social-french_society-Chart"
            >
              {frenchSocietyImpacts.map(({ name, impact, type }) => (
                <ImpactItemGroup key={name} isClickable>
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts-social-french_society-${name}-Chart`}
                    initialState={{
                      sectionName: "social",
                      subSectionName: "french_society",
                      impactName: name,
                    }}
                    {...modalData}
                  />
                  <ImpactItemDetails
                    label={getSocialImpactLabel(name)}
                    value={impact.difference}
                    labelProps={getDialogControlButtonProps(
                      `fr-modal-impacts-social-french_society-${name}-Chart`,
                    )}
                    data={
                      impact.details
                        ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                            label: getSocialImpactLabel(detailsName),
                            value: detailsImpact.difference,
                            labelProps: getDialogControlButtonProps(
                              `fr-modal-impacts-social-french_society-${name}-${detailsName}-Chart`,
                            ),
                          }))
                        : undefined
                    }
                    type={type}
                  />
                  {(impact.details ?? []).map(({ name: detailsName }) => (
                    <ImpactModalDescription
                      key={detailsName}
                      dialogId={`fr-modal-impacts-social-french_society-${name}-${detailsName}-Chart`}
                      initialState={{
                        sectionName: "social",
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

export default SocialListSection;
