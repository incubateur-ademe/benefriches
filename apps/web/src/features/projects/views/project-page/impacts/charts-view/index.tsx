import { selectProjectName } from "@/features/projects/application/projectImpacts.reducer";
import { selectEconomicBalanceProjectImpacts } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { selectEnvironmentalProjectImpacts } from "@/features/projects/application/projectImpactsEnvironmental.selectors";
import { selectSocialProjectImpacts } from "@/features/projects/application/projectImpactsSocial.selectors";
import {
  selectSocioEconomicProjectImpactsByActor,
  selectTotalSocioEconomicImpact,
} from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactsChartsView from "./ImpactsChartsView";

type Props = {
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsChartsViewContainer = ({ openImpactDescriptionModal }: Props) => {
  const economicBalance = useAppSelector(selectEconomicBalanceProjectImpacts);
  const socioEconomicImpactsByActor = useAppSelector(selectSocioEconomicProjectImpactsByActor);
  const socioEconomicTotalImpact = useAppSelector(selectTotalSocioEconomicImpact);
  const environmentImpacts = useAppSelector(selectEnvironmentalProjectImpacts);
  const socialImpacts = useAppSelector(selectSocialProjectImpacts);
  const projectName = useAppSelector(selectProjectName);

  return (
    <ImpactsChartsView
      projectName={projectName}
      openImpactDescriptionModal={openImpactDescriptionModal}
      economicBalance={economicBalance}
      socialImpacts={socialImpacts}
      environmentImpacts={environmentImpacts}
      socioEconomicTotalImpact={socioEconomicTotalImpact}
      socioEconomicImpactsByActor={socioEconomicImpactsByActor}
    />
  );
};

export default ImpactsChartsViewContainer;
