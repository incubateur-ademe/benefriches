import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
  EditorialPageButtonsSection,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  involvesReinstatement: boolean;
  onNext: () => void;
  onBack: () => void;
};

const ProjectExpensesIntroduction = ({ involvesReinstatement, onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>💸</EditorialPageIcon>
      <EditorialPageTitle>Votre projet va engendrer des dépenses.</EditorialPageTitle>
      <EditorialPageText>
        {involvesReinstatement
          ? "Notamment pour la remise en état de la friche, l’installation des panneaux photovoltaïques et son exploitation."
          : "Notamment pour l’installation des panneaux photovoltaïques et son exploitation."}
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default ProjectExpensesIntroduction;
