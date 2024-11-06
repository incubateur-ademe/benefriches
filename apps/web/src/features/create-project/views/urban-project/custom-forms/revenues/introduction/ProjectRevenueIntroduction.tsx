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
};

const ProjectRevenueIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>💰</EditorialPageIcon>
      <EditorialPageTitle>Votre projet peut aussi engendrer des recettes</EditorialPageTitle>
      <EditorialPageText>
        Les aides aux travaux et l’exploitation des bâtiments peuvent générer des recettes
        financières.{" "}
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default ProjectRevenueIntroduction;
