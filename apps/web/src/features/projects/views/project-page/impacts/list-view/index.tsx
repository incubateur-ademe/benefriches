import { getEconomicBalanceProjectImpactsSelector } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { getEnvironmentalProjectImpactsSelector } from "@/features/projects/application/projectImpactsEnvironmental.selectors";
import { getSocialProjectImpactsSelector } from "@/features/projects/application/projectImpactsSocial.selectors";
import { getDetailedSocioEconomicProjectImpactsSelector } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactsListView from "./ImpactsListView";

type Props = {
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsListViewContainer = ({ openImpactDescriptionModal }: Props) => {
  const economicBalance = useAppSelector(getEconomicBalanceProjectImpactsSelector);
  const socioEconomicImpacts = useAppSelector(getDetailedSocioEconomicProjectImpactsSelector);
  const environmentImpacts = useAppSelector(getEnvironmentalProjectImpactsSelector);
  const socialImpacts = useAppSelector(getSocialProjectImpactsSelector);

  return (
    <ImpactsListView
      openImpactDescriptionModal={openImpactDescriptionModal}
      economicBalance={economicBalance}
      socialImpacts={socialImpacts}
      environmentImpacts={environmentImpacts}
      socioEconomicImpacts={socioEconomicImpacts}
    />
  );
};

export default ImpactsListViewContainer;
