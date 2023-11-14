import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  onNext: () => void;
};

const ProjectRevenueIntroduction = ({ onNext }: Props) => {
  return (
    <>
      <h2>Recettes liées au projet</h2>
      <p>
        Les aides aux travaux et l’exploitation des panneaux photovoltaïques
        vont générer des recettes financières.
      </p>
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default ProjectRevenueIntroduction;
