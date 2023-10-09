import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  onNext: () => void;
};

const FricheSoilIntroduction = ({ onNext }: Props) => {
  return (
    <>
      <p>
        Commençons par parler des <strong>sols</strong> qui existent
        actuellement sur la friche : leur typologie et leur superficie.
      </p>
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default FricheSoilIntroduction;
