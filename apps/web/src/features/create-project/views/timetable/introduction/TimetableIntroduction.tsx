import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  onNext: () => void;
};

const TimetableIntroduction = ({ onNext }: Props) => {
  return (
    <>
      <h2>C’est presque fini !</h2>
      <p>Quand commence ce beau projet ?</p>
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default TimetableIntroduction;
