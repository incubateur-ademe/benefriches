import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const ProjectCostsIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <WizardFormLayout title="Coûts liés au projet">
      <p>
        Les travaux de remise en état de la friche, d'installation des panneaux, de raccordement et
        d'exploitation vont générer des dépenses.
      </p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default ProjectCostsIntroduction;
