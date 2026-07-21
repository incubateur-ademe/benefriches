import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import ProjectExpensesIntroduction from "./ProjectExpensesIntroduction";

function ProjectExpensesIntroductionContainer() {
  const { onNext, onBack } = useRenewableEnergyForm();

  return <ProjectExpensesIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectExpensesIntroductionContainer;
