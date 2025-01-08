import { ReactNode } from "react";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactModalDescriptionProvider from "./ImpactModalDescriptionProvider";

type ModalDescriptionProviderProps = {
  children: ReactNode;
};

function ImpactModalDescriptionProviderContainer({ children }: ModalDescriptionProviderProps) {
  const { projectData, relatedSiteData, impactsData } = useAppSelector(
    (state) => state.projectImpacts,
  );

  return (
    <ImpactModalDescriptionProvider
      projectData={projectData!}
      siteData={relatedSiteData!}
      impactsData={impactsData!}
    >
      {children}
    </ImpactModalDescriptionProvider>
  );
}

export default ImpactModalDescriptionProviderContainer;
