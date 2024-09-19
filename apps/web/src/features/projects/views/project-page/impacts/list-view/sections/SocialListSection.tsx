import { getSocialImpactLabel } from "../../getImpactLabel";
import { ImpactDescriptionModalCategory } from "../../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";

import {
  SocialImpact,
  SocialImpactName,
} from "@/features/projects/application/projectImpactsSocial.selectors";

type Props = {
  impacts: SocialImpact[];
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const SOCIAL_SECTIONS = {
  jobs: ["full_time_jobs"],
  residents: ["avoided_vehicule_kilometers", "travel_time_saved", "avoided_traffic_accidents"],
  french_society: ["avoided_friche_accidents", "households_powered_by_renewable_energy"],
};

const getImpactItemOnClick = (
  itemName: SocialImpactName,
  openImpactDescriptionModal: Props["openImpactDescriptionModal"],
) => {
  switch (itemName) {
    case "households_powered_by_renewable_energy":
      return () => {
        openImpactDescriptionModal("social.households-powered-by-renewable-energy");
      };
    case "travel_time_saved":
      return () => {
        openImpactDescriptionModal("social.time-travel-saved");
      };
    case "avoided_vehicule_kilometers":
      return () => {
        openImpactDescriptionModal("social.avoided-vehicule-kilometers");
      };
    case "full_time_jobs":
      return () => {
        openImpactDescriptionModal("social.full-time-jobs");
      };
    case "conversion_full_time_jobs":
      return () => {
        openImpactDescriptionModal("social.full-time-reconversion-jobs");
      };
    case "operations_full_time_jobs":
      return () => {
        openImpactDescriptionModal("social.full-time-operation-jobs");
      };
    default:
      return undefined;
  }
};

const SocialListSection = ({ impacts, openImpactDescriptionModal }: Props) => {
  const jobsImpacts = impacts.filter(({ name }) => SOCIAL_SECTIONS.jobs.includes(name));
  const residentsImpacts = impacts.filter(({ name }) => SOCIAL_SECTIONS.residents.includes(name));
  const frenchSocietyImpacts = impacts.filter(({ name }) =>
    SOCIAL_SECTIONS.french_society.includes(name),
  );

  return (
    <ImpactSection
      title="Impacts sociaux"
      isMain
      onTitleClick={() => {
        openImpactDescriptionModal("social");
      }}
    >
      {jobsImpacts.length > 0 && (
        <ImpactSection title="Impacts sur l'emploi">
          {jobsImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup
              key={name}
              onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
            >
              <ImpactItemDetails
                isTotal
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                        onClick: getImpactItemOnClick(detailsName, openImpactDescriptionModal),
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
            <ImpactItemGroup
              key={name}
              onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
            >
              <ImpactItemDetails
                isTotal
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                        onClick: getImpactItemOnClick(detailsName, openImpactDescriptionModal),
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
            <ImpactItemGroup
              key={name}
              onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
            >
              <ImpactItemDetails
                isTotal
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                        onClick: getImpactItemOnClick(detailsName, openImpactDescriptionModal),
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
