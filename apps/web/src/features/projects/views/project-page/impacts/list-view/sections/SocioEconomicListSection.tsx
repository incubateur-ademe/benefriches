import { useContext } from "react";

import {
  SocioEconomicDetailedImpact,
  SocioEconomicImpactByCategory,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import { getSocioEconomicImpactLabel } from "@/features/projects/views/project-page/impacts/getImpactLabel";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import { ImpactModalDescriptionContext } from "../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";

type Props = {
  socioEconomicImpacts: SocioEconomicDetailedImpact;
};

const SocioEconomicImpactSection = ({
  impacts,
  total,
  title,
}: SocioEconomicImpactByCategory & {
  title: string;
}) => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

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

const SocioEconomicImpactsListSection = ({ socioEconomicImpacts }: Props) => {
  const { economicDirect, economicIndirect, environmentalMonetary, socialMonetary, total } =
    socioEconomicImpacts;
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <ImpactSection
      title="Impacts socio-économiques"
      isMain
      total={total}
      initialShowSectionContent={false}
      onTitleClick={() => {
        openImpactModalDescription({ sectionName: "socio_economic" });
      }}
    >
      <SocioEconomicImpactSection title="Impacts économiques directs" {...economicDirect} />
      <SocioEconomicImpactSection title="Impacts économiques indirects" {...economicIndirect} />
      <SocioEconomicImpactSection title="Impacts sociaux monétarisés" {...socialMonetary} />
      <SocioEconomicImpactSection
        title="Impacts environnementaux monétarisés"
        {...environmentalMonetary}
      />
    </ImpactSection>
  );
};

export default SocioEconomicImpactsListSection;
