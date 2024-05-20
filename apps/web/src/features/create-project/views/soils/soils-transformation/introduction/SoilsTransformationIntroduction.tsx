import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const SoilsTransformationIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <WizardFormLayout title="Nous allons maintenant parler de ce que seront les sols du site.">
      <p>
        Le site va accueillir des panneaux photovoltaïques, sous lesquels le sol peut être conservé
        en l'état ou être transformé.
      </p>
      <p>
        Cela aura un impact direct sur la capacité d'absorption de l'eau et sur le pouvoir de
        stockage du carbone, il est donc important de bien renseigner cette partie.
      </p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default SoilsTransformationIntroduction;
