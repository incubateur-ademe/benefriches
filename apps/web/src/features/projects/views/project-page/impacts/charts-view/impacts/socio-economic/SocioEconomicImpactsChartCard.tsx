import { useContext } from "react";

import { SocioEconomicImpactByActor } from "@/features/projects/domain/projectImpactsSocioEconomic";

import { ImpactModalDescriptionContext } from "../../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactsChartsSection from "../../ImpactsChartsSection";
import SocioEconomicImpactsByActorChart from "./SocioEconomicImpactsByActorChart";

type Props = {
  socioEconomicImpacts: SocioEconomicImpactByActor;
};

function SocioEconomicChartCard({ socioEconomicImpacts }: Props) {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <ImpactsChartsSection
      onClick={() => {
        openImpactModalDescription({ sectionName: "socio_economic" });
      }}
      title="Impacts socio-économiques"
      subtitle="Par bénéficiaires"
    >
      <SocioEconomicImpactsByActorChart socioEconomicImpacts={socioEconomicImpacts} />
    </ImpactsChartsSection>
  );
}

export default SocioEconomicChartCard;
