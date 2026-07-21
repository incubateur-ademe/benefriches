import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import SoilsTransformationIntroduction from "./SoilsTransformationIntroduction";

function SoilsTransformationIntroductionContainer() {
  const { onNext, onBack } = useRenewableEnergyForm();

  return <SoilsTransformationIntroduction onNext={onNext} onBack={onBack} />;
}

export default SoilsTransformationIntroductionContainer;
