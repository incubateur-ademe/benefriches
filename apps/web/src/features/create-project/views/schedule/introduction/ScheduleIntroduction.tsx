import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const ScheduleIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <>
      <h2>C’est presque fini !</h2>
      <p>Quand commence ce beau projet ?</p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default ScheduleIntroduction;
