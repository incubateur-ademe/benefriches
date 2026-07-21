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

const UsesIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🏠</EditorialPageIcon>
      <EditorialPageTitle>Parlons d'abord des usages du projet urbain.</EditorialPageTitle>
      <EditorialPageText>
        Quels usages y aura-t-il sur votre site ? Logements, bureaux, commerces, espaces verts,
        voirie... Sélectionnez tous les usages prévus dans votre projet.
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default UsesIntroduction;
