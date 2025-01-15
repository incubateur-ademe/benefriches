import { useContext } from "react";

import { SocioEconomicImpactByCategory } from "@/features/projects/domain/projectImpactsSocioEconomic";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import { ImpactModalDescriptionContext } from "../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";

type Props = SocioEconomicImpactByCategory & {
  title: string;
  initialShowSectionContent?: boolean;
  noMarginBottom?: boolean;
};
const SocioEconomicImpactSection = ({ impacts, total, title, ...props }: Props) => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  if (impacts.length === 0) {
    return null;
  }
  return (
    <ImpactSection title={title} total={total} {...props}>
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
                      impactName: name,
                      impactDetailsName: detailsName,
                    });
                  },
                }))
              : undefined,
          }))}
          onClick={() => {
            openImpactModalDescription({ sectionName: "socio_economic", impactName: name });
          }}
          type="monetary"
        />
      ))}
    </ImpactSection>
  );
};

export default SocioEconomicImpactSection;
