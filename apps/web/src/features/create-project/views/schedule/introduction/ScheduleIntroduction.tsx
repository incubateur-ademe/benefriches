import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const ScheduleIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <WizardFormLayout title="C'est presque fini !">
      <p>Quand commence ce beau projet ?</p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default ScheduleIntroduction;
