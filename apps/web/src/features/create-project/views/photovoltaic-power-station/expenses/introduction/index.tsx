import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import ProjectExpensesIntroduction from "./ProjectExpensesIntroduction";

function ProjectExpensesIntroductionContainer() {
  const { onNext, onBack, selectInvolvesReinstatementViewData } = useRenewableEnergyForm();
  const { initialValues } = useAppSelector(selectInvolvesReinstatementViewData);

  return (
    <ProjectExpensesIntroduction
      involvesReinstatement={initialValues?.involvesReinstatement === "yes"}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default ProjectExpensesIntroductionContainer;
