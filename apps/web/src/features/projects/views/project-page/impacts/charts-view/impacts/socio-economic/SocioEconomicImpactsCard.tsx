import { SocioEconomicImpactByActor } from "@/features/projects/domain/projectImpactsSocioEconomic";

import ImpactsChartsSection from "../../ImpactsChartsSection";
import SocioEconomicImpactsByActorChart from "./SocioEconomicImpactsByActorChart";

type Props = {
  socioEconomicImpacts: SocioEconomicImpactByActor;
  onClick: () => void;
};

function SocioEconomicImpactsCard({ socioEconomicImpacts, onClick }: Props) {
  return (
    <ImpactsChartsSection onClick={onClick} title="Impacts socio-économiques">
      <SocioEconomicImpactsByActorChart socioEconomicImpacts={socioEconomicImpacts} />
    </ImpactsChartsSection>
  );
}

export default SocioEconomicImpactsCard;
