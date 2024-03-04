import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const ProjectCostsIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <>
      <h2>Coûts liés au projet</h2>
      <p>
        Les travaux de remise en état de la friche, d’installation des panneaux, de raccordement et
        d’exploitation vont générer des dépenses.
      </p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default ProjectCostsIntroduction;
