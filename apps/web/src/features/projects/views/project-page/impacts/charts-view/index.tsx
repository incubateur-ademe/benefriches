import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactsChartsView from "./ImpactsChartsView";

import { getProjectName } from "@/features/projects/application/projectImpacts.reducer";
import { getEconomicBalanceProjectImpacts } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { getEnvironmentalProjectImpacts } from "@/features/projects/application/projectImpactsEnvironmental.selectors";
import { getSocialProjectImpacts } from "@/features/projects/application/projectImpactsSocial.selectors";
import { getSocioEconomicProjectImpactsByActor } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsChartsViewContainer = ({ openImpactDescriptionModal }: Props) => {
  const economicBalance = useAppSelector(getEconomicBalanceProjectImpacts);
  const socioEconomicImpacts = useAppSelector(getSocioEconomicProjectImpactsByActor);
  const environmentImpacts = useAppSelector(getEnvironmentalProjectImpacts);
  const socialImpacts = useAppSelector(getSocialProjectImpacts);
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
