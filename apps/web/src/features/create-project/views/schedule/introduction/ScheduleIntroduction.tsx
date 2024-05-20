import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const ScheduleIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <WizardFormLayout title="Pour quand ce projet est-il prévu ?">
      <p>
        Pour pouvoir calculer les impacts du projet sur une certaine durée, nous avons besoin de
        connaître les différéntes échéances.
      </p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default ScheduleIntroduction;
