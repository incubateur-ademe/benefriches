import { useContext } from "react";

import { SocioEconomicImpactByCategory } from "@/features/projects/domain/projectImpactsSocioEconomic";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import { ImpactModalDescriptionContext } from "../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";

type Props = SocioEconomicImpactByCategory & {
  sectionName:
    | "economic_direct"
    | "economic_indirect"
    | "social_monetary"
    | "environmental_monetary";
  initialShowSectionContent?: boolean;
  noMarginBottom?: boolean;
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
const SocioEconomicImpactSection = ({ impacts, total, sectionName, ...props }: Props) => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  if (impacts.length === 0) {
    return null;
  }

  return (
    <ImpactSection
      title={getSectionTitle(sectionName)}
      total={total}
      {...props}
      onTitleClick={() => {
        openImpactModalDescription({
          sectionName: "socio_economic",
          subSectionName: sectionName,
        });
      }}
    >
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
                  onClick: () => {
                    openImpactModalDescription({
                      sectionName: "socio_economic",
                      subSectionName: sectionName,
                      impactName: name,
                      impactDetailsName: detailsName,
                    });
                  },
                }))
              : undefined,
          }))}
          onClick={() => {
            openImpactModalDescription({
              sectionName: "socio_economic",
              subSectionName: sectionName,
              impactName: name,
            });
          }}
          type="monetary"
        />
      ))}
    </ImpactSection>
  );
};

export default SocioEconomicImpactSection;
