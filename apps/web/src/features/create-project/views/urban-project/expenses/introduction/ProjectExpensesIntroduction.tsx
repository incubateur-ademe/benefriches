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

const ProjectExpensesIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>💸</EditorialPageIcon>
      <EditorialPageTitle>Votre projet va engendrer des dépenses.</EditorialPageTitle>
      <EditorialPageText>
        Les travaux de remise en état de la friche, l'aménagement du projet urbain ainsi que son
        éventuelle exploitation vont générer des dépenses.
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default ProjectExpensesIntroduction;
