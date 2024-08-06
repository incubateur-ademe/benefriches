import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { SoilType } from "shared";
import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactAreaChartCard from "./ImpactChartCard/ImpactAreaChartCard";
import ImpactsChartsSection from "./ImpactsChartsSection";

import {
  EnvironmentalImpact,
  EnvironmentalImpactName,
} from "@/features/projects/application/projectImpactsEnvironmental.selectors";
import {
  getEnvironmentalDetailsImpactLabel,
  getEnvironmentalImpactLabel,
} from "@/features/projects/views/project-page/impacts/getImpactLabel";
import { getColorForCarbonStorageSoilType } from "@/shared/domain/soils";
import HighchartsCustomColorsWrapper from "@/shared/views/components/Charts/HighchartsCustomColorsWrapper";

type Props = {
  projectName: string;
  impacts: EnvironmentalImpact[];
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const Row = ({ children }: { children: ReactNode }) => {
  return <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>{children}</div>;
};

const ENVIRONMENTAL_IMPACTS: EnvironmentalImpactName[] = [
  "avoided_co2_eq_emissions_with_production",
  "co2_benefit",
  "permeable_surface_area",
  "non_contaminated_surface_area",
];

const getImpactOnClick = (
  itemName: EnvironmentalImpactName,
  openImpactDescriptionModal: Props["openImpactDescriptionModal"],
) => {
  switch (itemName) {
    case "non_contaminated_surface_area":
      return () => {
        openImpactDescriptionModal("environmental.non-contamined-surface");
      };
    case "permeable_surface_area":
      return () => {
        openImpactDescriptionModal("environmental.permeable-surface");
      };
    case "stored_co2_eq":
      return () => {
        openImpactDescriptionModal("environmental.carbon-storage");
      };
    default:
      return undefined;
  }
};

const formatImpactForChartAreaCard = ({
  impact,
  name,
}: {
  impact: Props["impacts"][number]["impact"];
  name: Props["impacts"][number]["name"];
}) => {
  return {
    impactLabel: getEnvironmentalImpactLabel(name),
    base: impact.base,
    forecast: impact.forecast,
    difference: impact.difference,
    data: impact.details
      ? impact.details.map((impactDetails) => ({
          impactLabel: getEnvironmentalDetailsImpactLabel(name, impactDetails.name),
          base: impactDetails.impact.base,
          forecast: impactDetails.impact.forecast,
          difference: impactDetails.impact.difference,
        }))
      : [
          {
            impactLabel: getEnvironmentalImpactLabel(name),
            base: impact.base,
            forecast: impact.forecast,
          },
        ],
  };
};

const ImpactsChartsEnvironmentSection = ({
  projectName,
  impacts,
  openImpactDescriptionModal,
}: Props) => {
  const impactsList = ENVIRONMENTAL_IMPACTS.reduce(
    (list: Props["impacts"], impactName: EnvironmentalImpactName) => {
      const impact = impacts.find(({ name }) => impactName === name);
      return impact ? [...list, impact] : list;
    },
    [],
  );

  const soilsCarbonStorage = impacts.find(({ name }) => name === "soils_carbon_storage");

  return (
    <ImpactsChartsSection
      onClick={() => {
        openImpactDescriptionModal("environmental");
      }}
      title="Impacts environnementaux"
    >
      <Row>
        {soilsCarbonStorage && (
          <div className={fr.cx("fr-col-lg-3", "fr-col-6")}>
            <HighchartsCustomColorsWrapper
              colors={(soilsCarbonStorage.impact.details ?? []).map(({ name }) =>
                getColorForCarbonStorageSoilType(name.toUpperCase() as SoilType),
              )}
            >
              <ImpactAreaChartCard
                onClick={() => {
                  openImpactDescriptionModal("environmental.carbon-storage");
                }}
                type="co2"
                baseLabel="Pas de changement"
                forecastLabel={projectName}
                impact={formatImpactForChartAreaCard({
                  impact: soilsCarbonStorage.impact,
                  name: "soils_carbon_storage",
                })}
              />
            </HighchartsCustomColorsWrapper>
          </div>
        )}

        {impactsList.map(({ name, impact, type }) => (
          <div className={fr.cx("fr-col-lg-3", "fr-col-6")} key={name}>
            <ImpactAreaChartCard
              type={type}
              baseLabel="Pas de changement"
              forecastLabel={projectName}
              impact={formatImpactForChartAreaCard({ impact, name })}
              onClick={getImpactOnClick(name, openImpactDescriptionModal)}
            />
          </div>
        ))}
      </Row>
    </ImpactsChartsSection>
  );
};

export default ImpactsChartsEnvironmentSection;
