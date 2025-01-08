import {
  EnvironmentalImpact,
  EnvironmentalImpactName,
} from "@/features/projects/domain/projectImpactsEnvironmental";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-page/impacts/impact-description-modals/ImpactDescriptionModalWizard";

import {
  getEnvironmentalDetailsImpactLabel,
  getEnvironmentalImpactLabel,
} from "../../getImpactLabel";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";

type Props = {
  impacts: EnvironmentalImpact[];
};

const itemDescriptionModalIds: Partial<
  Record<EnvironmentalImpactName, ImpactDescriptionModalCategory>
> = {
  non_contaminated_surface_area: "environmental.non-contamined-surface",
  permeable_surface_area: "environmental.permeable-surface",
  mineral_soil: "environmental.minerale-surface",
  green_soil: "environmental.green-surface",
  avoided_co2_eq_emissions_with_production: "environmental.avoided-co2-renewable-energy",
  stored_co2_eq: "environmental.carbon-storage",
};

const ENVIRONMENTAL_SECTIONS = {
  co2: ["co2_benefit"],
  soils: ["non_contaminated_surface_area", "permeable_surface_area"],
};

const EnvironmentalListSection = ({ impacts }: Props) => {
  const co2Impacts = impacts.filter(({ name }) => ENVIRONMENTAL_SECTIONS.co2.includes(name));
  const soilsImpacts = impacts.filter(({ name }) => ENVIRONMENTAL_SECTIONS.soils.includes(name));

  return (
    <ImpactSection isMain title="Impacts environnementaux">
      {co2Impacts.length > 0 && (
        <ImpactSection title="Impacts sur le CO2-eq">
          {co2Impacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name} isClickable>
              <ImpactItemDetails
                label={getEnvironmentalImpactLabel(name)}
                value={impact.difference}
                descriptionModalId={itemDescriptionModalIds[name]}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getEnvironmentalDetailsImpactLabel(name, detailsName),
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

      {soilsImpacts.length > 0 && (
        <ImpactSection title="Impacts sur  les sols">
          {soilsImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name} isClickable>
              <ImpactItemDetails
                label={getEnvironmentalImpactLabel(name)}
                value={impact.difference}
                descriptionModalId={itemDescriptionModalIds[name]}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getEnvironmentalDetailsImpactLabel(name, detailsName),
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

export default EnvironmentalListSection;
