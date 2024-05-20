import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const ProjectStakeholdersIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <WizardFormLayout
      title={
        <span>
          🧑‍💼
          <br />
          Différents acteurs vont prendre part à votre projet
        </span>
      }
    >
      <p>
        Nous avons besoin de les connaître pour savoir à qui seront imputables les différents coûts,
        recettes et impacts.
      </p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default ProjectStakeholdersIntroduction;
