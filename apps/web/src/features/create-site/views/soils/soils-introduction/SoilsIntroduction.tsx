import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  onNext: () => void;
  isFriche: boolean;
};

const SiteSoilsIntroduction = ({ isFriche, onNext }: Props) => {
  return (
    <>
      <p>
        Commençons par parler des <strong>sols</strong> qui existent
        actuellement sur {isFriche ? "la friche" : "le site"} : leur typologie
        et leur superficie.
      </p>
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default SiteSoilsIntroduction;
