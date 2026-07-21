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

const SpacesIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🌾</EditorialPageIcon>
      <EditorialPageTitle>
        Parlons maintenant des sols et espaces qui composeront le projet urbain.
      </EditorialPageTitle>
      <EditorialPageText>
        Quels types de sols composeront votre projet ? Bâtiments, sols imperméables, espaces verts,
        prairies... Sélectionnez tous les types d'espaces prévus.
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default SpacesIntroduction;
