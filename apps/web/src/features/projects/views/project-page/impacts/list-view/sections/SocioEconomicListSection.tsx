import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";

import {
  SocioEconomicDetailedImpact,
  SocioEconomicImpactName,
} from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { getSocioEconomicImpactLabel } from "@/features/projects/views/project-page/impacts/getImpactLabel";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-page/impacts/impact-description-modals/ImpactDescriptionModalWizard";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

type Props = {
  socioEconomicImpacts: SocioEconomicDetailedImpact;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const getImpactItemOnClick = (
  itemName: SocioEconomicImpactName,
  openImpactDescriptionModal: Props["openImpactDescriptionModal"],
) => {
  switch (itemName) {
    case "avoided_co2_eq_with_enr":
      return () => {
        openImpactDescriptionModal("socio-economic.avoided-co2-renewable-energy");
      };
    case "avoided_friche_costs":
      return () => {
        openImpactDescriptionModal("socio-economic.avoided-friche-costs");
      };
    case "avoided_illegal_dumping_costs":
      return () => {
        openImpactDescriptionModal("socio-economic.avoided-illegal-dumping-costs");
      };
    case "avoided_security_costs":
      return () => {
        openImpactDescriptionModal("socio-economic.avoided-security-costs");
      };
    case "avoided_other_securing_costs":
      return () => {
        openImpactDescriptionModal("socio-economic.avoided-other-securing-costs");
      };
    case "ecosystem_services":
      return () => {
        openImpactDescriptionModal("socio-economic.ecosystem-services");
      };
    case "nature_related_wellness_and_leisure":
      return () => {
        openImpactDescriptionModal(
          "socio-economic.ecosystem-services.nature-related-wellness-and-leisure",
        );
      };
    case "carbon_storage":
      return () => {
        openImpactDescriptionModal("socio-economic.ecosystem-services.carbon-storage");
      };

    case "forest_related_product":
      return () => {
        openImpactDescriptionModal("socio-economic.ecosystem-services.forest-related-product");
      };

    case "nitrogen_cycle":
      return () => {
        openImpactDescriptionModal("socio-economic.ecosystem-services.nitrogen-cycle");
      };

    case "water_cycle":
      return () => {
        openImpactDescriptionModal("socio-economic.ecosystem-services.water-cycle");
      };
    case "pollination":
      return () => {
        openImpactDescriptionModal("socio-economic.ecosystem-services.pollinisation");
      };
    case "soil_erosion":
      return () => {
        openImpactDescriptionModal("socio-economic.ecosystem-services.soil-erosion");
      };
    case "invasive_species_regulation":
      return () => {
        openImpactDescriptionModal("socio-economic.ecosystem-services.invasive-species-regulation");
      };
    case "water_regulation":
      return () => {
        openImpactDescriptionModal("socio-economic.water-regulation");
      };
    default:
      return undefined;
  }
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
      onClick={() => {
        openImpactDescriptionModal("socio-economic");
      }}
    >
      {economicDirect.impacts.length > 0 && (
        <ImpactSection title="Impacts économiques directs" total={economicDirect.total}>
          {economicDirect.impacts.map(({ name, actors }) => (
            <ImpactActorsItem
              key={name}
              label={getSocioEconomicImpactLabel(name)}
              actors={actors.map(
                ({ name: actorLabel, value: actorValue, details: actorDetails }) => ({
                  label: getActorLabel(actorLabel),
                  value: actorValue,
                  details: actorDetails
                    ? actorDetails.map(({ name: detailsName, value: detailsValue }) => ({
                        label: getSocioEconomicImpactLabel(detailsName),
                        value: detailsValue,
                        onClick: getImpactItemOnClick(detailsName, openImpactDescriptionModal),
                      }))
                    : undefined,
                }),
              )}
              onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
              type="monetary"
            />
          ))}
        </ImpactSection>
      )}

      {economicIndirect.impacts.length > 0 && (
        <ImpactSection title="Impacts économiques indirects" total={economicIndirect.total}>
          {economicIndirect.impacts.map(({ name, actors }) => (
            <ImpactActorsItem
              key={name}
              label={getSocioEconomicImpactLabel(name)}
              actors={actors.map(({ name: actorLabel, value: actorValue }) => ({
                label: getActorLabel(actorLabel),
                value: actorValue,
              }))}
              onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
              type="monetary"
            />
          ))}
        </ImpactSection>
      )}

      {socialMonetary.impacts.length > 0 && (
        <ImpactSection title="Impacts sociaux monétarisés" total={socialMonetary.total}>
          {socialMonetary.impacts.map(({ name, actors }) => (
            <ImpactActorsItem
              key={name}
              label={getSocioEconomicImpactLabel(name)}
              actors={actors.map(
                ({ name: actorName, value: actorValue, details: actorDetails }) => ({
                  label: getActorLabel(actorName),
                  value: actorValue,
                  details: actorDetails
                    ? actorDetails.map(({ name: detailsName, value: detailsValue }) => ({
                        label: getSocioEconomicImpactLabel(detailsName),
                        value: detailsValue,
                        onClick: getImpactItemOnClick(detailsName, openImpactDescriptionModal),
                      }))
                    : undefined,
                }),
              )}
              onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
              type="monetary"
            />
          ))}
        </ImpactSection>
      )}

      {environmentalMonetary.impacts.length > 0 && (
        <ImpactSection
          title="Impacts environnementaux monétarisés"
          total={environmentalMonetary.total}
        >
          {environmentalMonetary.impacts.map(({ name, actors }) => (
            <ImpactActorsItem
              key={name}
              label={getSocioEconomicImpactLabel(name)}
              actors={actors.map(
                ({ name: actorName, value: actorValue, details: actorDetails }) => ({
                  label: getActorLabel(actorName),
                  value: actorValue,
                  details: actorDetails
                    ? actorDetails.map(({ name: detailsName, value: detailsValue }) => ({
                        label: getSocioEconomicImpactLabel(detailsName),
                        value: detailsValue,
                        onClick: getImpactItemOnClick(detailsName, openImpactDescriptionModal),
                      }))
                    : undefined,
                }),
              )}
              onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
              type="monetary"
            />
          ))}
        </ImpactSection>
      )}
    </ImpactSection>
  );
};

export default SocioEconomicImpactsListSection;
