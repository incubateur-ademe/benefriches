import ImpactsChartsSection from "../../ImpactsChartsSection";
import SocioEconomicImpactsByActorChart from "./SocioEconomicImpactsByActorChart";

import { SocioEconomicImpactByActorAndCategory } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";

type Props = {
  socioEconomicImpacts: SocioEconomicImpactByActorAndCategory;
  onClick: () => void;
};

function SocioEconomicImpactsCard({ socioEconomicImpacts, onClick }: Props) {
  return (
    <ImpactsChartsSection onClick={onClick} title="Impacts socio-économiques">
      <SocioEconomicImpactsByActorChart socioEconomicImpacts={socioEconomicImpacts.byActor} />
    </ImpactsChartsSection>
  );
}

export default SocioEconomicImpactsCard;
