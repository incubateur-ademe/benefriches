import { SocialImpact, SocialImpactName } from "@/features/projects/domain/projectImpactsSocial";
import { getSocialImpactLabel } from "@/features/projects/views/project-page/impacts/getImpactLabel";

import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactAreaChartCard from "./ImpactChartCard/ImpactAreaChartCard";
import ImpactsChartsSection from "./ImpactsChartsSection";

type Props = {
  projectName: string;
  impacts: SocialImpact[];
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const getImpactOnClick = (
  itemName: SocialImpactName,
  openImpactDescriptionModal: Props["openImpactDescriptionModal"],
) => {
  switch (itemName) {
    case "households_powered_by_renewable_energy":
      return () => {
        openImpactDescriptionModal("social.households-powered-by-renewable-energy");
      };
    case "full_time_jobs":
      return () => {
        openImpactDescriptionModal("social.full-time-jobs");
      };
    default:
      return undefined;
  }
};

const SOCIAL_IMPACTS: SocialImpactName[] = [
  "full_time_jobs",
  "avoided_friche_accidents",
  "avoided_traffic_accidents",
  "households_powered_by_renewable_energy",
];

const formatImpactForChartAreaCard = ({
  impact,
  name,
}: {
  impact: Props["impacts"][number]["impact"];
  name: Props["impacts"][number]["name"];
}) => {
  return {
    impactLabel: getSocialImpactLabel(name),
    base: impact.base,
    forecast: impact.forecast,
    difference: impact.difference,
    data: impact.details
      ? impact.details.map((impactDetails) => ({
          impactLabel: getSocialImpactLabel(impactDetails.name),
          base: impactDetails.impact.base,
          forecast: impactDetails.impact.forecast,
          difference: impactDetails.impact.difference,
        }))
      : [
          {
            impactLabel: getSocialImpactLabel(name),
            base: impact.base,
            forecast: impact.forecast,
          },
        ],
  };
};

const getImpactUnitSuffix = (name: Props["impacts"][number]["name"], difference: number) => {
  const isPlural = Math.abs(difference) > 1;
  switch (name) {
    case "avoided_traffic_accidents":
    case "avoided_friche_accidents":
      return isPlural ? "\u00A0accidents évités" : "\u00A0accident évité";
    case "full_time_jobs":
      return "\u00A0ETP";
    case "households_powered_by_renewable_energy":
      return isPlural ? "\u00A0foyers" : "\u00A0u00A0foyer";
  }
};

const ImpactsChartsSocialSection = ({
  projectName,
  impacts,
  openImpactDescriptionModal,
}: Props) => {
  const impactsList = SOCIAL_IMPACTS.reduce(
    (list: SocialImpact[], impactName: SocialImpactName) => {
      const impact = impacts.find(({ name }) => impactName === name);
      return impact ? [...list, impact] : list;
    },
    [],
  );

  return (
    <ImpactsChartsSection
      title="Impacts sociaux"
      onClick={() => {
        openImpactDescriptionModal("social");
      }}
    >
      <div className="tw-grid tw-gap-6 md:tw-grid-cols-2 lg:tw-grid-cols-4 ">
        {impactsList.map(({ name, impact, type }) => (
          <ImpactAreaChartCard
            type={type}
            key={name}
            unitSuffix={getImpactUnitSuffix(name, impact.difference)}
            baseLabel="Pas de changement"
            forecastLabel={projectName}
            impact={formatImpactForChartAreaCard({ impact, name })}
            onClick={getImpactOnClick(name, openImpactDescriptionModal)}
          />
        ))}
      </div>
    </ImpactsChartsSection>
  );
};

export default ImpactsChartsSocialSection;
