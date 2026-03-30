import { useForm } from "react-hook-form";
import {
  sumObjectValues,
  type BuildingsUseDistribution,
  type UrbanProjectUseWithBuilding,
} from "shared";

import {
  getLabelForUrbanProjectUse,
  getPictogramUrlForUrbanProjectUse,
} from "@/features/create-project/core/urban-project/urbanProject";
import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: BuildingsUseDistribution | undefined;
  selectedUses: UrbanProjectUseWithBuilding[];
  usesFloorSurfaceAreaDistribution: BuildingsUseDistribution;
  remainingUsesFloorSurfaceAreaDistribution: BuildingsUseDistribution;
  onSubmit: (data: BuildingsUseDistribution) => void;
  onBack: () => void;
};

function BuildingsNewBuildingsUsesFloorSurfaceArea({
  initialValues,
  selectedUses,
  usesFloorSurfaceAreaDistribution,
  remainingUsesFloorSurfaceAreaDistribution,
  onSubmit,
  onBack,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<BuildingsUseDistribution>({
    defaultValues: initialValues,
    mode: "onChange",
  });

  const totalAllocatedSurfaceArea = sumObjectValues(watch());

  return (
    <WizardFormLayout
      title="Quels usages accueilleront les nouveaux bâtiments ?"
      instructions={
        <FormInfo>
          <p>Répartition globale prévue :</p>
          <ul>
            {selectedUses.map((use) => (
              <li key={use}>
                {getLabelForUrbanProjectUse(use)} :{" "}
                <strong>{formatSurfaceArea(usesFloorSurfaceAreaDistribution[use] ?? 0)}</strong>
              </li>
            ))}
          </ul>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {selectedUses.map((use) => {
          const maxSurfaceArea = remainingUsesFloorSurfaceAreaDistribution[use] ?? 0;

          return (
            <RowDecimalsNumericInput
              key={use}
              addonText={SQUARE_METERS_HTML_SYMBOL}
              label={getLabelForUrbanProjectUse(use)}
              hintText={`Maximum : ${formatSurfaceArea(maxSurfaceArea)}`}
              imgSrc={getPictogramUrlForUrbanProjectUse(use)}
              state={formState.errors[use] ? "error" : "default"}
              stateRelatedMessage={formState.errors[use]?.message}
              nativeInputProps={register(use, {
                ...optionalNumericFieldRegisterOptions,
                max: {
                  value: maxSurfaceArea,
                  message: `La surface ne peut pas dépasser celle restant à affecter pour cet usage (${formatSurfaceArea(maxSurfaceArea)})`,
                },
              })}
            />
          );
        })}
        <RowNumericInput
          label="Total"
          addonText={SQUARE_METERS_HTML_SYMBOL}
          nativeInputProps={{
            value: totalAllocatedSurfaceArea,
          }}
          disabled
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default BuildingsNewBuildingsUsesFloorSurfaceArea;
