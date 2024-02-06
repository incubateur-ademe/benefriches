import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  onNext: () => void;
};

const ProjectCostsIntroduction = ({ onNext }: Props) => {
  return (
    <>
      <h2>Coûts liés au projet</h2>
      <p>
        Les travaux de remise en état de la friche, d’installation des panneaux, de raccordement et
        d’exploitation vont générer des dépenses.
      </p>
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default ProjectCostsIntroduction;
