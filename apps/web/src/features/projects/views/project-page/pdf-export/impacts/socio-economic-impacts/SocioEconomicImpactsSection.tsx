import { View } from "@react-pdf/renderer";

import { SocioEconomicImpactByCategory } from "@/features/projects/domain/projectImpactsSocioEconomic";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import { getSocioEconomicImpactLabel } from "../../../impacts/getImpactLabel";
import ImpactsGroupByActor from "../../components/ImpactsGroupByActor";
import ImpactsSection from "../../components/ImpactsSection";

type Props = SocioEconomicImpactByCategory & {
  sectionName:
    | "economic_direct"
    | "economic_indirect"
    | "social_monetary"
    | "environmental_monetary";
};

const getSectionTitle = (sectionName: Props["sectionName"]) => {
  switch (sectionName) {
    case "economic_direct":
      return "Impacts économiques directs";
    case "economic_indirect":
      return "Impacts économiques indirects";
    case "social_monetary":
      return "Impacts sociaux monétarisés";
    case "environmental_monetary":
      return "Impacts environnementaux monétarisés";
  }
};
export default function SocioEconomicImpactsSection({ impacts, total, sectionName }: Props) {
  if (impacts.length === 0) {
    return null;
  }

  return (
    <View id={`impacts.socio_economic.${sectionName}`}>
      <ImpactsSection title={getSectionTitle(sectionName)} total={total} valueType="monetary">
        {impacts.map(({ name, actors }) => (
          <ImpactsGroupByActor
            key={name}
            type="monetary"
            label={getSocioEconomicImpactLabel(name)}
            actors={actors.map(
              ({ name: actorLabel, value: actorValue, details: actorDetails }) => ({
                label: getActorLabel(actorLabel),
                value: actorValue,
                details: actorDetails
                  ? actorDetails.map(({ name: detailsName, value: detailsValue }) => ({
                      label: getSocioEconomicImpactLabel(detailsName),
                      value: detailsValue,
                    }))
                  : undefined,
              }),
            )}
          />
        ))}
      </ImpactsSection>
    </View>
  );
}
