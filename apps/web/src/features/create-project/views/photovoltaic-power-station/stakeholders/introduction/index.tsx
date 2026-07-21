import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import ProjectStakeholdersIntroduction from "@/features/create-project/views/project-form/common/stakeholder-introduction/StakeholdersIntroduction";

function ProjectStakeholdersIntroductionContainer() {
  const { onNext, onBack } = useRenewableEnergyForm();

  return <ProjectStakeholdersIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectStakeholdersIntroductionContainer;
