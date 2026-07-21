import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

function ProjectRevenueIntroductionContainer() {
  const { onNext, onBack } = useRenewableEnergyForm();

  return <ProjectRevenueIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectRevenueIntroductionContainer;
