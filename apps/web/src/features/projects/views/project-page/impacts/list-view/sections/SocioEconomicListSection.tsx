import { useContext } from "react";

import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";

import { ImpactModalDescriptionContext } from "../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactSection from "../ImpactSection";
import SocioEconomicImpactSection from "./SocioEconomicImpactSection";

type Props = {
  socioEconomicImpacts: SocioEconomicDetailedImpact;
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
      <SocioEconomicImpactSection sectionName="economic_direct" {...economicDirect} />
      <SocioEconomicImpactSection sectionName="economic_indirect" {...economicIndirect} />
      <SocioEconomicImpactSection sectionName="social_monetary" {...socialMonetary} />
      <SocioEconomicImpactSection sectionName="environmental_monetary" {...environmentalMonetary} />
    </ImpactSection>
  );
};

export default SocioEconomicImpactsListSection;
