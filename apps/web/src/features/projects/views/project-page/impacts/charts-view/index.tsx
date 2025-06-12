import {
  selectModalData,
  selectProjectName,
} from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import {
  selectEnvironmentalAreaChartImpactsData,
  selectSocialAreaChartImpactsData,
} from "@/features/projects/application/project-impacts/projectImpactsAreaChartsData";
import { selectEconomicBalanceProjectImpacts } from "@/features/projects/application/project-impacts/projectImpactsEconomicBalance.selectors";
import {
  selectSocioEconomicProjectImpactsByActor,
  selectTotalSocioEconomicImpact,
} from "@/features/projects/application/project-impacts/projectImpactsSocioEconomic.selectors";
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
