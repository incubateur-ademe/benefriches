import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
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
      <EditorialPageTitle> Parlons dépollution.</EditorialPageTitle>
      <EditorialPageText>
        Le site existant comporte {formatSurfaceArea(contaminatedSurfaceArea)} de sols pollués.
      </EditorialPageText>
      <EditorialPageText>Il est possible d’en dépolluer tout ou partie.</EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default SoilsDecontaminationIntroduction;
