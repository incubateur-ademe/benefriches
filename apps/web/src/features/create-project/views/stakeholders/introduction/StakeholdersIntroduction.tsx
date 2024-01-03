import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  onNext: () => void;
};

const ProjectStakeholdersIntroduction = ({ onNext }: Props) => {
  return (
    <>
      <h2>Différents acteurs vont prendre part à votre projet</h2>
      <p>
        Nous avons besoin de les connaître pour savoir à qui seront imputables les différents coûts,
        recettes et impacts.
      </p>
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default ProjectStakeholdersIntroduction;
