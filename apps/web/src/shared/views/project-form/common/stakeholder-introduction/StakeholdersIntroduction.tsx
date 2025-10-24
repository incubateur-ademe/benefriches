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

const ProjectStakeholdersIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🧑‍💼</EditorialPageIcon>
      <EditorialPageTitle> Différents acteurs vont prendre part à votre projet</EditorialPageTitle>
      <EditorialPageText>
        Nous avons besoin de les connaître pour savoir à qui seront imputables les différentes
        dépenses, recettes et impacts.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default ProjectStakeholdersIntroduction;
