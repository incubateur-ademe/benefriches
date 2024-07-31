import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSectionHeader from "../ImpactSectionHeader";

import {
  SocioEconomicDetailedImpact,
  SocioEconomicImpactName,
} from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { getSocioEconomicImpactLabel } from "@/features/projects/views/project-page/impacts/getImpactLabel";
import ImpactMainTitle from "@/features/projects/views/project-page/impacts/list-view/ImpactMainTitle";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-page/impacts/modals/ImpactDescriptionModalWizard";
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
    case "ecosystem_services":
      return () => {
        openImpactDescriptionModal("socio-economic.ecosystem-services");
      };
    case "nature_related_wellness_and_leisure":
      return () => {
        openImpactDescriptionModal("socio-economic.nature-related-wellness-and-leisure");
      };
    case "carbon_storage":
      return () => {
        openImpactDescriptionModal("socio-economic.carbon-storage");
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
  const { economicDirect, economicIndirect, environmentalMonetary, socialMonetary } =
    socioEconomicImpacts;

  return (
    <section className="fr-mb-5w">
      <ImpactMainTitle
        title="Impacts socio-économiques"
        onClick={() => {
          openImpactDescriptionModal("socio-economic");
        }}
      />

      {economicDirect.impacts.length > 0 && (
        <>
          <ImpactSectionHeader title="Impacts économiques directs" total={economicDirect.total} />

          {economicDirect.impacts.map(({ name, actors }) => (
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
        </>
      )}

      {economicIndirect.impacts.length > 0 && (
        <>
          <ImpactSectionHeader
            title="Impacts économiques indirects"
            total={economicIndirect.total}
          />

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
        </>
      )}

      {socialMonetary.impacts.length > 0 && (
        <>
          <ImpactSectionHeader title="Impacts sociaux monétarisés" total={socialMonetary.total} />

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
        </>
      )}

      {environmentalMonetary.impacts.length > 0 && (
        <>
          <ImpactSectionHeader
            title="Impacts environnementaux monétarisés"
            total={environmentalMonetary.total}
          />

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
        </>
      )}
    </section>
  );
};

export default SocioEconomicImpactsListSection;
