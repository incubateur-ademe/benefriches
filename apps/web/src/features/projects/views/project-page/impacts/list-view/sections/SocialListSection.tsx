import { useContext } from "react";

import { SocialImpact, SocialImpactName } from "@/features/projects/domain/projectImpactsSocial";

import { getSocialImpactLabel } from "../../getImpactLabel";
import { ImpactDescriptionModalCategory } from "../../impact-description-modals/ImpactDescriptionModalWizard";
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

const itemDescriptionModalIds: Partial<Record<SocialImpactName, ImpactDescriptionModalCategory>> = {
  households_powered_by_renewable_energy: "social.households-powered-by-renewable-energy",
  travel_time_saved: "social.time-travel-saved",
  avoided_vehicule_kilometers: "social.avoided-vehicule-kilometers",
  full_time_jobs: "social.full-time-jobs",
  conversion_full_time_jobs: "social.full-time-reconversion-jobs",
  operations_full_time_jobs: "social.full-time-operation-jobs",
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
        openImpactModalDescription("social");
      }}
    >
      {jobsImpacts.length > 0 && (
        <ImpactSection title="Impacts sur l'emploi">
          {jobsImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name} isClickable>
              <ImpactItemDetails
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                descriptionModalId={itemDescriptionModalIds[name]}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                        descriptionModalId: itemDescriptionModalIds[detailsName],
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
        <ImpactSection title="Impacts sur les riverains">
          {residentsImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name} isClickable>
              <ImpactItemDetails
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                descriptionModalId={itemDescriptionModalIds[name]}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                        descriptionModalId: itemDescriptionModalIds[detailsName],
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
        <ImpactSection title="Impacts sur la société française">
          {frenchSocietyImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name} isClickable>
              <ImpactItemDetails
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                descriptionModalId={itemDescriptionModalIds[name]}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                        descriptionModalId: itemDescriptionModalIds[detailsName],
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
