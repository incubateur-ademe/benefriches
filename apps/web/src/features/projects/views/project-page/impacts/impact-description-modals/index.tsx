import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import {
  ImpactDescriptionModalCategory,
  ImpactDescriptionModalWizard,
} from "./ImpactDescriptionModalWizard";

type Props = {
  modalCategory: ImpactDescriptionModalCategory;
  onChangeModalCategoryOpened: (modalCategory: ImpactDescriptionModalCategory) => void;
};

function ImpactDescriptionModalWizardWrapper({
  modalCategory,
  onChangeModalCategoryOpened,
}: Props) {
  const { projectData, relatedSiteData, impactsData } = useAppSelector(
    (state) => state.projectImpacts,
  );

  return (
    <ImpactDescriptionModalWizard
      modalCategory={modalCategory}
      onChangeModalCategoryOpened={onChangeModalCategoryOpened}
      projectData={projectData!}
      siteData={relatedSiteData!}
      impactsData={impactsData!}
    />
  );
}

export default ImpactDescriptionModalWizardWrapper;
