import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const ProjectRevenueIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <WizardFormLayout title="Recettes liés au projet">
      <p>L'exploitation des panneaux photovoltaïques va générer des recettes financières.</p>
      <BackNextButtonsGroup onNext={onNext} onBack={onBack} />
    </WizardFormLayout>
  );
};

export default ProjectRevenueIntroduction;
