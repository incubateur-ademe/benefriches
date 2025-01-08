import { selectEconomicBalanceProjectImpacts } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { selectEnvironmentalProjectImpacts } from "@/features/projects/application/projectImpactsEnvironmental.selectors";
import { selectSocialProjectImpacts } from "@/features/projects/application/projectImpactsSocial.selectors";
import { selectDetailedSocioEconomicProjectImpacts } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactsListView from "./ImpactsListView";

const ImpactsListViewContainer = () => {
  const economicBalance = useAppSelector(selectEconomicBalanceProjectImpacts);
  const socioEconomicImpacts = useAppSelector(selectDetailedSocioEconomicProjectImpacts);
  const environmentImpacts = useAppSelector(selectEnvironmentalProjectImpacts);
  const socialImpacts = useAppSelector(selectSocialProjectImpacts);

  return (
    <ImpactsListView
      economicBalance={economicBalance}
      socialImpacts={socialImpacts}
      environmentImpacts={environmentImpacts}
      socioEconomicImpacts={socioEconomicImpacts}
    />
  );
};

export default ImpactsListViewContainer;
