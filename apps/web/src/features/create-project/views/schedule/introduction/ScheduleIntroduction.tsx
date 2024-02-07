import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  onNext: () => void;
};

const ScheduleIntroduction = ({ onNext }: Props) => {
  return (
    <>
      <h2>C’est presque fini !</h2>
      <p>Quand commence ce beau projet ?</p>
      <Button onClick={onNext}>Suivant</Button>
    </>
  );
};

export default ScheduleIntroduction;
