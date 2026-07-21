import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
  EditorialPageButtonsSection,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
  contaminatedSurfaceArea: number;
};

const SoilsDecontaminationIntroduction = ({ onNext, onBack, contaminatedSurfaceArea }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>✨</EditorialPageIcon>
      <EditorialPageTitle>Et si on dépolluait les sols ?</EditorialPageTitle>
      <EditorialPageText>
        Le site existant comporte {formatSurfaceArea(contaminatedSurfaceArea)} de sols pollués.
      </EditorialPageText>
      <EditorialPageText>Voyons quelle part vous souhaitez dépolluer.</EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default SoilsDecontaminationIntroduction;
