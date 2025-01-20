import { useContext } from "react";

import { SocialImpact } from "@/features/projects/domain/projectImpactsSocial";

import { getSocialImpactLabel } from "../../getImpactLabel";
import { ImpactModalDescriptionContext } from "../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";

type Props = {
  impacts: SocialImpact[];
};

const SOCIAL_SECTIONS = {
  jobs: ["full_time_jobs"],
  residents: ["avoided_vehicule_kilometers", "travel_time_saved", "avoided_traffic_accidents"],
  french_society: ["avoided_friche_accidents", "households_powered_by_renewable_energy"],
};

const SocialListSection = ({ impacts }: Props) => {
  const jobsImpacts = impacts.filter(({ name }) => SOCIAL_SECTIONS.jobs.includes(name));
  const residentsImpacts = impacts.filter(({ name }) => SOCIAL_SECTIONS.residents.includes(name));
  const frenchSocietyImpacts = impacts.filter(({ name }) =>
    SOCIAL_SECTIONS.french_society.includes(name),
  );

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <ImpactSection
      title="Impacts sociaux"
      isMain
      onTitleClick={() => {
        openImpactModalDescription({ sectionName: "social" });
      }}
    >
      {jobsImpacts.length > 0 && (
        <ImpactSection
          title="Impacts sur l'emploi"
          onTitleClick={() => {
            openImpactModalDescription({
              sectionName: "social",
              subSectionName: "jobs",
            });
          }}
        >
          {jobsImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name} isClickable>
              <ImpactItemDetails
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                onClick={() => {
                  openImpactModalDescription({
                    sectionName: "social",
                    subSectionName: "jobs",
                    impactName: name,
                  });
                }}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                        onClick: () => {
                          openImpactModalDescription({
                            sectionName: "social",
                            impactName: name,
                            impactDetailsName: detailsName,
                          });
                        },
                      }))
                    : undefined
                }
                type={type}
              />
            </ImpactItemGroup>
          ))}
        </ImpactSection>
      )}

      {residentsImpacts.length > 0 && (
        <ImpactSection
          title="Impacts sur la population locale"
          onTitleClick={() => {
            openImpactModalDescription({
              sectionName: "social",
              subSectionName: "local_people",
            });
          }}
        >
          {residentsImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name} isClickable>
              <ImpactItemDetails
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                onClick={() => {
                  openImpactModalDescription({
                    sectionName: "social",
                    subSectionName: "local_people",
                    impactName: name,
                  });
                }}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                        onClick: () => {
                          openImpactModalDescription({
                            sectionName: "social",
                            impactName: name,
                            impactDetailsName: detailsName,
                          });
                        },
                      }))
                    : undefined
                }
                type={type}
              />
            </ImpactItemGroup>
          ))}
        </ImpactSection>
      )}

      {frenchSocietyImpacts.length > 0 && (
        <ImpactSection
          title="Impacts sur la société française"
          onTitleClick={() => {
            openImpactModalDescription({
              sectionName: "social",
              subSectionName: "french_society",
            });
          }}
        >
          {frenchSocietyImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name} isClickable>
              <ImpactItemDetails
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                onClick={() => {
                  openImpactModalDescription({
                    sectionName: "social",
                    subSectionName: "french_society",
                    impactName: name,
                  });
                }}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                        onClick: () => {
                          openImpactModalDescription({
                            sectionName: "social",
                            impactName: name,
                            impactDetailsName: detailsName,
                          });
                        },
                      }))
                    : undefined
                }
                type={type}
              />
            </ImpactItemGroup>
          ))}
        </ImpactSection>
      )}
    </ImpactSection>
  );
};

export default SocialListSection;
