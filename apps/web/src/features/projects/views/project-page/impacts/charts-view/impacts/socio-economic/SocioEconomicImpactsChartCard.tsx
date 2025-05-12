import {
  SocioEconomicImpactByActor,
  SocioEconomicMainImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import { getSocioEconomicImpactColor } from "../../../getImpactColor";
import ImpactModalDescription, {
  ModalDataProps,
} from "../../../impact-description-modals/ImpactModalDescription";
import ImpactColumnChart from "../../ImpactChartCard/ImpactColumnChart";
import ImpactColumnChartCard from "../../ImpactChartCard/ImpactColumnChartCard";

type Props = {
  socioEconomicImpacts: SocioEconomicImpactByActor;
  modalData: ModalDataProps;
};

const getMaxColor = (
  impacts: {
    name: SocioEconomicMainImpactName;
    value: number;
  }[],
) => {
  const max = impacts.sort((a, b) => Math.abs(b.value) - Math.abs(a.value))[0];

  if (max) {
    return getSocioEconomicImpactColor(max.name);
  }
};

function SocioEconomicChartCard({ socioEconomicImpacts, modalData }: Props) {
  return (
    <>
      <ImpactModalDescription
        dialogId="fr-modal-impacts-socio_economic-Chart"
        {...modalData}
        initialState={{ sectionName: "socio_economic" }}
      />
      <ImpactColumnChartCard
        title="Impacts socio-économiques"
        subtitle="Par bénéficiaires"
        dialogId="fr-modal-impacts-socio_economic-Chart"
      >
        <ImpactColumnChart
          data={socioEconomicImpacts.map(({ name, total, impacts }) => ({
            value: total,
            label: getActorLabel(name),
            color: getMaxColor(impacts),
          }))}
        />
      </ImpactColumnChartCard>
    </>
  );
}

export default SocioEconomicChartCard;
