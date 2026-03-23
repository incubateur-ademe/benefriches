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
};

const SoilContaminationIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>☣️</EditorialPageIcon>
      <EditorialPageTitle>La friche est peut-être polluée.</EditorialPageTitle>
      <EditorialPageText>
        Cela n'empêchera pas la réalisation du projet mais nécessitera des travaux de dépollution.
        Voyons quelle est la superficie polluée.
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default SoilContaminationIntroduction;
