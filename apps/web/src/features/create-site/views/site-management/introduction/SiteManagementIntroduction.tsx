import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  onNext: () => void;
};

const SiteManagementIntroduction = ({ onNext }: Props) => {
  return (
    <>
      <h2>Parlons maintenant de la gestion du site</h2>
      <p>
        Différents acteurs sont liés à la friche, et différentes dépenses
        peuvent leur incomber.
      </p>
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default SiteManagementIntroduction;
