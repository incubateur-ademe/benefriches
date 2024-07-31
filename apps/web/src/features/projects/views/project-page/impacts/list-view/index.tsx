import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactsListView from "./ImpactsListView";

import { getEconomicBalanceProjectImpacts } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { getEnvironmentalProjectImpacts } from "@/features/projects/application/projectImpactsEnvironmental.selectors";
import { getSocialProjectImpacts } from "@/features/projects/application/projectImpactsSocial.selectors";
import { getDetailedSocioEconomicProjectImpacts } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsListViewContainer = ({ openImpactDescriptionModal }: Props) => {
  const economicBalance = useAppSelector(getEconomicBalanceProjectImpacts);
  const socioEconomicImpacts = useAppSelector(getDetailedSocioEconomicProjectImpacts);
  const environmentImpacts = useAppSelector(getEnvironmentalProjectImpacts);
  const socialImpacts = useAppSelector(getSocialProjectImpacts);

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
