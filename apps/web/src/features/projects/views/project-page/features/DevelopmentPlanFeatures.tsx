import { typedObjectEntries } from "shared";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import { getLabelForMixedUseNeighbourhoodSpace } from "@/shared/domain/mixedUseNeighbourhood";
import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import { sumList } from "@/shared/services/sum/sum";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

type Props = ProjectFeatures["developmentPlan"];

export default function DevelopmentPlanFeatures(props: Props) {
  switch (props.type) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return (
        <Section title="⚙️ Paramètres du projet">
          <DataLine
            label={<strong>Puissance d'installation</strong>}
            value={`${formatNumberFr(props.electricalPowerKWc)} kWc`}
          />
          <DataLine
            label={<strong>Superficie occupée par les panneaux</strong>}
            value={formatSurfaceArea(props.surfaceArea)}
          />
          <DataLine
            label={<strong>Production annuelle attendue</strong>}
            value={`${formatNumberFr(props.expectedAnnualProduction)} MWh / an`}
          />
          <DataLine
            label={<strong>Durée du contrat de revente d'énergie</strong>}
            value={`${formatNumberFr(props.contractDuration)} ans`}
          />
        </Section>
      );
    case "MIXED_USE_NEIGHBOURHOOD":
      return (
        <Section title="🏘 Espaces du quartier">
          <DataLine
            label={<strong>Superficie totale</strong>}
            value={formatSurfaceArea(sumList(Object.values(props.spaces)))}
          />
          {typedObjectEntries(props.spaces).map(([space, surfaceArea]) => {
            return (
              <DataLine
                label={getLabelForMixedUseNeighbourhoodSpace(space)}
                value={formatSurfaceArea(surfaceArea)}
                key={space}
                className="fr-pl-2w"
              />
            );
          })}
        </Section>
      );
  }
}
