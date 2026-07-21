import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import InvolvesReinstatementForm from "@/features/create-project/views/urban-project/soils/involves-reinstatement/InvolvesReinstatementForm";

export default function InvolvesReinstatementContainer() {
  const { onBack, onRequestStepCompletion, selectInvolvesReinstatementViewData } =
    useRenewableEnergyForm();
  const { initialValues } = useAppSelector(selectInvolvesReinstatementViewData);

  return (
    <InvolvesReinstatementForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
          answers: {
            involvesReinstatement: formData.involvesReinstatement === "yes",
          },
        });
      }}
      onBack={onBack}
      initialValues={initialValues}
    />
  );
}
