import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageButtonsSection,
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  buildingsFootprintToConstruct: number;
  onNext: () => void;
  onBack: () => void;
};

const BuildingsNewConstructionIntroduction = ({
  buildingsFootprintToConstruct,
  onNext,
  onBack,
}: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🏗️</EditorialPageIcon>
      <EditorialPageTitle>
        {formatSurfaceArea(buildingsFootprintToConstruct)} de surface au sol de nouveaux bâtiments
        seront à construire pour le projet urbain.
      </EditorialPageTitle>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default BuildingsNewConstructionIntroduction;
