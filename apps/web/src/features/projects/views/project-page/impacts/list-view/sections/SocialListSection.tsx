import { getSocialImpactLabel } from "../../getImpactLabel";
import ImpactItem from "../ImpactItem";
import ImpactMainTitle from "../ImpactMainTitle";
import ImpactSectionHeader from "../ImpactSectionHeader";

import {
  SocialImpact,
  SocialImpactName,
} from "@/features/projects/application/projectImpactsSocial.selectors";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-page/impacts/impact-description-modals/ImpactDescriptionModalWizard";

type Props = {
  impacts: SocialImpact[];
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const SOCIAL_SECTIONS = {
  jobs: ["full_time_jobs"],
  residents: [
    "avoided_friche_accidents",
    "avoided_vehicule_kilometers",
    "travel_time_saved",
    "avoided_traffic_accidents",
  ],
  french_society: ["households_powered_by_renewable_energy"],
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
    <section>
      <ImpactMainTitle
        title="Impacts sociaux"
        onClick={() => {
          openImpactDescriptionModal("social");
        }}
      />
      {jobsImpacts.length > 0 && (
        <>
          <ImpactSectionHeader title="Impacts sur l'emploi" />

          {jobsImpacts.map(({ name, impact, type }) => (
            <ImpactItem
              key={name}
              isTotal
              label={getSocialImpactLabel(name)}
              value={impact.difference}
              onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
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
          ))}
        </>
      )}

      {residentsImpacts.length > 0 && (
        <>
          <ImpactSectionHeader title="Impacts sur les riverains" />

          {residentsImpacts.map(({ name, impact, type }) => (
            <ImpactItem
              key={name}
              isTotal
              label={getSocialImpactLabel(name)}
              value={impact.difference}
              onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
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
          ))}
        </>
      )}

      {frenchSocietyImpacts.length > 0 && (
        <>
          <ImpactSectionHeader title="Impacts sur la société française" />

          {frenchSocietyImpacts.map(({ name, impact, type }) => (
            <ImpactItem
              key={name}
              isTotal
              label={getSocialImpactLabel(name)}
              value={impact.difference}
              onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
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
          ))}
        </>
      )}
    </section>
  );
};

export default SocialListSection;
