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
        Notamment pour la remise en état de la friche, l’installation des panneaux photovoltaïques
        et son exploitation.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default ProjectExpensesIntroduction;
