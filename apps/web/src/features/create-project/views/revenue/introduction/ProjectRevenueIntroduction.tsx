import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  onNext: () => void;
};

const ProjectRevenueIntroduction = ({ onNext }: Props) => {
  return (
    <>
      <h2>Recettes liées au projet</h2>
      <p>L'exploitation des panneaux photovoltaïques va générer des recettes financières.</p>
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default ProjectRevenueIntroduction;
