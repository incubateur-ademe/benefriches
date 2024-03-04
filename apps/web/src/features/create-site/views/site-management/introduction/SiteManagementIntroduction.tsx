import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const SiteManagementIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <>
      <h2>Parlons maintenant de la gestion du site</h2>
      <p>
        Différents acteurs sont liés à la friche, et différentes dépenses peuvent leur incomber.
      </p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default SiteManagementIntroduction;
