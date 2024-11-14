import { getProjectName } from "@/features/projects/application/projectImpacts.reducer";
import { getEconomicBalanceProjectImpactsSelector } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { getEnvironmentalProjectImpactsSelector } from "@/features/projects/application/projectImpactsEnvironmental.selectors";
import { getSocialProjectImpactsSelector } from "@/features/projects/application/projectImpactsSocial.selectors";
import { getSocioEconomicProjectImpactsByActorSelector } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactsChartsView from "./ImpactsChartsView";

type Props = {
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsChartsViewContainer = ({ openImpactDescriptionModal }: Props) => {
  const economicBalance = useAppSelector(getEconomicBalanceProjectImpactsSelector);
  const socioEconomicImpacts = useAppSelector(getSocioEconomicProjectImpactsByActorSelector);
  const environmentImpacts = useAppSelector(getEnvironmentalProjectImpactsSelector);
  const socialImpacts = useAppSelector(getSocialProjectImpactsSelector);
  const projectName = useAppSelector(getProjectName);

  return (
    <ImpactsChartsView
      projectName={projectName}
      openImpactDescriptionModal={openImpactDescriptionModal}
      economicBalance={economicBalance}
      socialImpacts={socialImpacts}
      environmentImpacts={environmentImpacts}
      socioEconomicImpacts={socioEconomicImpacts}
    />
  );
};

export default ImpactsChartsViewContainer;
