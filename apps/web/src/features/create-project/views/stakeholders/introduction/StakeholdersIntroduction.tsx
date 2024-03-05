import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const ProjectStakeholdersIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <>
      <h2>Différents acteurs vont prendre part à votre projet</h2>
      <p>
        Nous avons besoin de les connaître pour savoir à qui seront imputables les différents coûts,
        recettes et impacts.
      </p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default ProjectStakeholdersIntroduction;
