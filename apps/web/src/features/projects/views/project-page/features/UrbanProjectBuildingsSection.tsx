import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { sumObjectValues, typedObjectEntries } from "shared";

import { UrbanProjectFeatures } from "@/features/projects/domain/projects.types";
import { formatPercentage, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { computePercentage } from "@/shared/core/percentage/percentage";
import { getLabelForBuildingsUse } from "@/shared/core/urbanProject";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";
import InfoTooltip from "@/shared/views/components/InfoTooltip/InfoTooltip";

type Props = {
  buildingsFloorArea: UrbanProjectFeatures["buildingsFloorArea"];
  isExpress: boolean;
  totalSurfaceArea: number;
  urbanProjectCategoryLabel: string;
  buttonProps?: ButtonProps;
};

const UrbanProjectBuildingsSection = ({
  buildingsFloorArea,
  isExpress,
  totalSurfaceArea,
  urbanProjectCategoryLabel,
  buttonProps,
}: Props) => {
  const totalBuildingsSurfaceArea = sumObjectValues(buildingsFloorArea);
  return (
    <Section
      buttonProps={buttonProps}
      title="🏢 Bâtiments"
      tooltip={
        isExpress
          ? "Répartition représentative de l’aménagement des espaces pour ce type de projet urbain. L’occupation des sols conditionne la capacité d’infiltration des eaux, la capacité de stockage de carbone dans les sols, etc."
          : undefined
      }
    >
      <DataLine
        noBorder
        label={<strong>Surface de plancher des bâtiments</strong>}
        value={formatSurfaceArea(totalBuildingsSurfaceArea)}
        valueTooltip={
          isExpress
            ? `On considère que la surface de plancher des bâtiments est de ${formatPercentage(computePercentage(totalBuildingsSurfaceArea, totalSurfaceArea))} de la surface du site des lieux d’habitation et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
            : undefined
        }
      />
      <h4 className="text-base pb-2 pt-4 mb-0">
        Usage des bâtiments{" "}
        <InfoTooltip title="L’usage des bâtiments correspond à leur destination (logements, services de proximité, bureaux, équipements publics, etc.)" />
      </h4>
      {typedObjectEntries(buildingsFloorArea).map(([use, value]) =>
        value ? (
          <DataLine
            key={use}
            label={getLabelForBuildingsUse(use)}
            value={formatSurfaceArea(value)}
            isDetails
            valueTooltip={
              isExpress
                ? `On considère que ${(() => {
                    switch (use) {
                      case "RESIDENTIAL":
                        return "les logements ";
                      case "LOCAL_STORE":
                        return "les commerces de proximité";
                      case "OFFICES":
                        return "les bureaux";
                      case "LOCAL_SERVICES":
                        return "les services de proximité";
                      case "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES":
                        return "les locaux industriels, artisanaux ou logistiques";
                      case "PUBLIC_FACILITIES":
                        return "les équipements publics";
                      case "CULTURAL_PLACE":
                        return "les lieux culturels";
                      case "SPORTS_FACILITIES":
                        return "les équipements sportifs";
                      case "MULTI_STORY_PARKING":
                        return "les parkings silo";
                      case "OTHER":
                        return "les autres types de bâtiments";
                    }
                  })()} occupent ${computePercentage(value, totalSurfaceArea)}} de la surface du site des lieux d’habitation et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                : undefined
            }
          />
        ) : undefined,
      )}
    </Section>
  );
};

export default UrbanProjectBuildingsSection;
