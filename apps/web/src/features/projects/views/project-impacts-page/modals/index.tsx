import {
  ImpactDescriptionModalCategory,
  ImpactDescriptionModalWizard,
} from "./ImpactDescriptionModalWizard";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  modalCategory: ImpactDescriptionModalCategory;
  onChangeModalCategoryOpened: (modalCategory: ImpactDescriptionModalCategory) => void;
};

function ImpactDescriptionModalWizardWrapper({
  modalCategory,
  onChangeModalCategoryOpened,
}: Props) {
  const { projectData, relatedSiteData } = useAppSelector((state) => state.projectImpacts);

  return (
    <ImpactDescriptionModalWizard
      modalCategory={modalCategory}
      onChangeModalCategoryOpened={onChangeModalCategoryOpened}
      projectData={projectData!}
      siteData={relatedSiteData!}
    />
  );
}

export default ImpactDescriptionModalWizardWrapper;
