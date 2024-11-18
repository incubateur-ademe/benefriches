import { selectEconomicBalanceProjectImpacts } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { selectEnvironmentalProjectImpacts } from "@/features/projects/application/projectImpactsEnvironmental.selectors";
import { selectSocialProjectImpacts } from "@/features/projects/application/projectImpactsSocial.selectors";
import { selectDetailedSocioEconomicProjectImpacts } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactsListView from "./ImpactsListView";

type Props = {
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsListViewContainer = ({ openImpactDescriptionModal }: Props) => {
  const economicBalance = useAppSelector(selectEconomicBalanceProjectImpacts);
  const socioEconomicImpacts = useAppSelector(selectDetailedSocioEconomicProjectImpacts);
  const environmentImpacts = useAppSelector(selectEnvironmentalProjectImpacts);
  const socialImpacts = useAppSelector(selectSocialProjectImpacts);

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
