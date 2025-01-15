import { ReactNode } from "react";

import { getKeyImpactIndicatorsListSelector } from "@/features/projects/application/projectKeyImpactIndicators.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactModalDescriptionProvider from "./ImpactModalDescriptionProvider";

type ModalDescriptionProviderProps = {
  children: ReactNode;
};

function ImpactModalDescriptionProviderContainer({ children }: ModalDescriptionProviderProps) {
  const { projectData, relatedSiteData, impactsData } = useAppSelector(
    (state) => state.projectImpacts,
  );

  const keyImpactIndicatorsList = useAppSelector(getKeyImpactIndicatorsListSelector);

  return (
    <ImpactModalDescriptionProvider
      projectData={projectData!}
      siteData={relatedSiteData!}
      impactsData={{
        socioEconomicList: impactsData?.socioeconomic ?? { impacts: [], total: 0 },
        keyImpactIndicatorsList,
      }}
    >
      {children}
    </ImpactModalDescriptionProvider>
  );
}

export default ImpactModalDescriptionProviderContainer;
