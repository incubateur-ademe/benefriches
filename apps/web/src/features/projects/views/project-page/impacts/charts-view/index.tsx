import {
  selectModalData,
  selectProjectName,
} from "@/features/projects/application/projectImpacts.reducer";
import {
  selectEnvironmentalAreaChartImpactsData,
  selectSocialAreaChartImpactsData,
} from "@/features/projects/application/projectImpactsAreaChartsData";
import { selectEconomicBalanceProjectImpacts } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import {
  selectSocioEconomicProjectImpactsByActor,
  selectTotalSocioEconomicImpact,
} from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactsChartsView from "./ImpactsChartsView";

const ImpactsChartsViewContainer = () => {
  const economicBalance = useAppSelector(selectEconomicBalanceProjectImpacts);
  const socioEconomicImpactsByActor = useAppSelector(selectSocioEconomicProjectImpactsByActor);
  const socioEconomicTotalImpact = useAppSelector(selectTotalSocioEconomicImpact);
  const socialAreaChartImpactsData = useAppSelector(selectSocialAreaChartImpactsData);
  const environmentalAreaChartImpactsData = useAppSelector(selectEnvironmentalAreaChartImpactsData);
  const projectName = useAppSelector(selectProjectName);

  const modalData = useAppSelector(selectModalData);

  return (
    <ImpactsChartsView
      projectName={projectName}
      economicBalance={economicBalance}
      socialAreaChartImpactsData={socialAreaChartImpactsData}
      environmentalAreaChartImpactsData={environmentalAreaChartImpactsData}
      socioEconomicTotalImpact={socioEconomicTotalImpact}
      socioEconomicImpactsByActor={socioEconomicImpactsByActor}
      modalData={modalData}
    />
  );
};

export default ImpactsChartsViewContainer;
