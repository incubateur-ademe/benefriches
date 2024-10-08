import {
  EnvironmentalImpact,
  EnvironmentalImpactName,
} from "@/features/projects/application/projectImpactsEnvironmental.selectors";
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
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const getImpactItemOnClick = (
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
    case "mineral_soil":
      return () => {
        openImpactDescriptionModal("environmental.minerale-surface");
      };
    case "green_soil":
      return () => {
        openImpactDescriptionModal("environmental.green-surface");
      };
    case "avoided_co2_eq_emissions_with_production":
      return () => {
        openImpactDescriptionModal("environmental.avoided-co2-renewable-energy");
      };
    case "stored_co2_eq":
      return () => {
        openImpactDescriptionModal("environmental.carbon-storage");
      };
    default:
      return undefined;
  }
};

const ENVIRONMENTAL_SECTIONS = {
  co2: ["co2_benefit"],
  soils: ["non_contaminated_surface_area", "permeable_surface_area"],
};

const EnvironmentalListSection = ({ impacts, openImpactDescriptionModal }: Props) => {
  const co2Impacts = impacts.filter(({ name }) => ENVIRONMENTAL_SECTIONS.co2.includes(name));
  const soilsImpacts = impacts.filter(({ name }) => ENVIRONMENTAL_SECTIONS.soils.includes(name));

  return (
    <ImpactSection isMain title="Impacts environnementaux">
      {co2Impacts.length > 0 && (
        <ImpactSection title="Impacts sur le CO2-eq">
          {co2Impacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name}>
              <ImpactItemDetails
                label={getEnvironmentalImpactLabel(name)}
                value={impact.difference}
                onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getEnvironmentalDetailsImpactLabel(name, detailsName),
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

      {soilsImpacts.length > 0 && (
        <ImpactSection title="Impacts sur  les sols">
          {soilsImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name}>
              <ImpactItemDetails
                label={getEnvironmentalImpactLabel(name)}
                value={impact.difference}
                onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getEnvironmentalDetailsImpactLabel(name, detailsName),
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

export default EnvironmentalListSection;
