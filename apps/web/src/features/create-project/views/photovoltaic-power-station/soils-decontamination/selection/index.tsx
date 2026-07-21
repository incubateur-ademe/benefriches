import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import SoilsDecontaminationSelection, {
  FormValues,
} from "@/features/create-project/views/project-form/common/soils-decontamination/selection/SoilsDecontaminationSelection";

function SoilsDecontaminationSelectionContainer() {
  const { onBack, onRequestStepCompletion, selectSoilsDecontaminationSelectionViewData } =
    useRenewableEnergyForm();
  const { initialValues } = useAppSelector(selectSoilsDecontaminationSelectionViewData);

  return (
    <SoilsDecontaminationSelection
      initialValues={initialValues}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
          answers: { decontaminationPlan: data.decontaminationSelection ?? "unknown" },
        });
      }}
      onBack={onBack}
    />
  );
}

export default SoilsDecontaminationSelectionContainer;
