import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const SiteManagementIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <WizardFormLayout title="Parlons maintenant de la gestion du site">
      <p>
        Différents acteurs sont liés à la friche, et différentes dépenses peuvent leur incomber.
      </p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default SiteManagementIntroduction;
