import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageButtonsSection,
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const SoilsAndSpacesIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🌾</EditorialPageIcon>
      <EditorialPageTitle>
        Parlons maintenant des sols et espaces qui composent la zone commerciale.
      </EditorialPageTitle>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default SoilsAndSpacesIntroduction;
