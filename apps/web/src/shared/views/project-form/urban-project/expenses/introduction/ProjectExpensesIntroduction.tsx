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

const ProjectExpensesIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>💸</EditorialPageIcon>
      <EditorialPageTitle>Votre projet va engendrer des dépenses.</EditorialPageTitle>
      <EditorialPageText>
        Les travaux de remise en état de la friche, l'aménagement du projet urbain ainsi que son
        éventuelle exploitation vont générer des dépenses.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default ProjectExpensesIntroduction;
