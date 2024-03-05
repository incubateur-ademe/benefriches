import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const ProjectRevenueIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <>
      <h2>Recettes liées au projet</h2>
      <p>L'exploitation des panneaux photovoltaïques va générer des recettes financières.</p>
      <BackNextButtonsGroup onNext={onNext} onBack={onBack} />
    </>
  );
};

export default ProjectRevenueIntroduction;
