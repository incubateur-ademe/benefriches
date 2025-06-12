import { selectModalData } from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import { selectEconomicBalanceProjectImpacts } from "@/features/projects/application/project-impacts/projectImpactsEconomicBalance.selectors";
import { selectEnvironmentalProjectImpacts } from "@/features/projects/application/project-impacts/projectImpactsEnvironmental.selectors";
import { selectSocialProjectImpacts } from "@/features/projects/application/project-impacts/projectImpactsSocial.selectors";
import { selectDetailedSocioEconomicProjectImpacts } from "@/features/projects/application/project-impacts/projectImpactsSocioEconomic.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactsListView from "./ImpactsListView";

const ImpactsListViewContainer = () => {
  const economicBalance = useAppSelector(selectEconomicBalanceProjectImpacts);
  const socioEconomicImpacts = useAppSelector(selectDetailedSocioEconomicProjectImpacts);
  const environmentImpacts = useAppSelector(selectEnvironmentalProjectImpacts);
  const socialImpacts = useAppSelector(selectSocialProjectImpacts);

  const modalData = useAppSelector(selectModalData);

  return (
    <ImpactsListView
      economicBalance={economicBalance}
      socialImpacts={socialImpacts}
      environmentImpacts={environmentImpacts}
      socioEconomicImpacts={socioEconomicImpacts}
      modalData={modalData}
    />
  );
};

export default ImpactsListViewContainer;
