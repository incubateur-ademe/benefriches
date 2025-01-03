import {
  SocioEconomicDetailedImpact,
  SocioEconomicImpactByCategory,
  SocioEconomicImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import { getSocioEconomicImpactLabel } from "@/features/projects/views/project-page/impacts/getImpactLabel";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-page/impacts/impact-description-modals/ImpactDescriptionModalWizard";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";

type Props = {
  socioEconomicImpacts: SocioEconomicDetailedImpact;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const itemDescriptionModalIds: Partial<
  Record<SocioEconomicImpactName, ImpactDescriptionModalCategory>
> = {
  avoided_co2_eq_with_enr: "socio-economic.avoided-co2-renewable-energy",
  rental_income: "socio-economic.rental-income",
  taxes_income: "socio-economic.taxes-income",
  avoided_friche_costs: "socio-economic.avoided-friche-costs",
  avoided_illegal_dumping_costs: "socio-economic.avoided-illegal-dumping-costs",
  avoided_security_costs: "socio-economic.avoided-security-costs",
  avoided_other_securing_costs: "socio-economic.avoided-other-securing-costs",
  local_transfer_duties_increase: "socio-economic.property-transfer-duties-increase",
  local_property_value_increase: "socio-economic.property-value-increase",
  ecosystem_services: "socio-economic.ecosystem-services",
  nature_related_wellness_and_leisure:
    "socio-economic.ecosystem-services.nature-related-wellness-and-leisure",
  carbon_storage: "socio-economic.ecosystem-services.carbon-storage",
  forest_related_product: "socio-economic.ecosystem-services.forest-related-product",
  nitrogen_cycle: "socio-economic.ecosystem-services.nitrogen-cycle",
  water_cycle: "socio-economic.ecosystem-services.water-cycle",
  pollination: "socio-economic.ecosystem-services.pollinisation",
  soil_erosion: "socio-economic.ecosystem-services.soil-erosion",
  invasive_species_regulation: "socio-economic.ecosystem-services.invasive-species-regulation",
  water_regulation: "socio-economic.water-regulation",
  roads_and_utilities_maintenance_expenses:
    "socio-economic.roads-and-utilities-maintenance-expenses",
};

const getImpactItemOnClick = (
  itemName: SocioEconomicImpactName,
  openImpactDescriptionModal: Props["openImpactDescriptionModal"],
) => {
  const modalId = itemDescriptionModalIds[itemName];

  return modalId
    ? () => {
        openImpactDescriptionModal(modalId);
      }
    : undefined;
};

const SocioEconomicImpactSection = ({
  impacts,
  total,
  title,
  openImpactDescriptionModal,
}: SocioEconomicImpactByCategory & {
  title: string;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
}) => {
  if (impacts.length === 0) {
    return null;
  }
  return (
    <ImpactSection title={title} total={total}>
      {impacts.map(({ name, actors }) => (
        <ImpactActorsItem
          key={name}
          label={getSocioEconomicImpactLabel(name)}
          actors={actors.map(({ name: actorLabel, value: actorValue, details: actorDetails }) => ({
            label: getActorLabel(actorLabel),
            value: actorValue,
            details: actorDetails
              ? actorDetails.map(({ name: detailsName, value: detailsValue }) => ({
                  label: getSocioEconomicImpactLabel(detailsName),
                  value: detailsValue,
                  onClick: getImpactItemOnClick(detailsName, openImpactDescriptionModal),
                }))
              : undefined,
          }))}
          onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
          type="monetary"
        />
      ))}
    </ImpactSection>
  );
};

const SocioEconomicImpactsListSection = ({
  socioEconomicImpacts,
  openImpactDescriptionModal,
}: Props) => {
  const { economicDirect, economicIndirect, environmentalMonetary, socialMonetary, total } =
    socioEconomicImpacts;

  return (
    <ImpactSection
      title="Impacts socio-économiques"
      isMain
      total={total}
      initialShowSectionContent={false}
      onTitleClick={() => {
        openImpactDescriptionModal("socio-economic");
      }}
    >
      <SocioEconomicImpactSection
        title="Impacts économiques directs"
        {...economicDirect}
        openImpactDescriptionModal={openImpactDescriptionModal}
      />
      <SocioEconomicImpactSection
        title="Impacts économiques indirects"
        {...economicIndirect}
        openImpactDescriptionModal={openImpactDescriptionModal}
      />
      <SocioEconomicImpactSection
        title="Impacts sociaux monétarisés"
        {...socialMonetary}
        openImpactDescriptionModal={openImpactDescriptionModal}
      />
      <SocioEconomicImpactSection
        title="Impacts environnementaux monétarisés"
        {...environmentalMonetary}
        openImpactDescriptionModal={openImpactDescriptionModal}
      />
    </ImpactSection>
  );
};

export default SocioEconomicImpactsListSection;
