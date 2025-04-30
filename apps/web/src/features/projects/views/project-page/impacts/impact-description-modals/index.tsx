import { ReactNode } from "react";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactModalDescriptionProvider from "./ImpactModalDescriptionProvider";

type ModalDescriptionProviderProps = {
  children: ReactNode;
  dialogId: string;
};

function ImpactModalDescriptionProviderContainer({
  children,
  dialogId,
}: ModalDescriptionProviderProps) {
  const { projectData, relatedSiteData, impactsData } = useAppSelector(
    (state) => state.projectImpacts,
  );

  return (
    <ImpactModalDescriptionProvider
      projectData={projectData!}
      siteData={relatedSiteData!}
      impactsData={impactsData!}
      dialogId={dialogId}
    >
      {children}
    </ImpactModalDescriptionProvider>
  );
}

export default ImpactModalDescriptionProviderContainer;
