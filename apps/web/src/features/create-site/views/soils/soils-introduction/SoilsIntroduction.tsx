import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
  isFriche: boolean;
};

const SiteSoilsIntroduction = ({ isFriche, onNext, onBack }: Props) => {
  const title = `Parlons d’abord des sols qui existent actuellement sur ${isFriche ? "la friche" : "le site"}`;
  return (
    <WizardFormLayout title={title}>
      <p>
        Nous avons besoin de connaître leur typologie, leur occupation et les superficies
        correspondantes.
      </p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default SiteSoilsIntroduction;
