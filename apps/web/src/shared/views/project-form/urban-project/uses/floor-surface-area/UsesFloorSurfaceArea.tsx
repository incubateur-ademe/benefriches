import { useForm } from "react-hook-form";
import {
  doesUseIncludeBuildings,
  type SurfaceAreaDistributionJson,
  type UrbanProjectUse,
} from "shared";

import {
  getLabelForUrbanProjectUse,
  getPictogramUrlForUrbanProjectUse,
} from "@/features/create-project/core/urban-project/urbanProject";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: SurfaceAreaDistributionJson<UrbanProjectUse>;
  selectedUses: UrbanProjectUse[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = SurfaceAreaDistributionJson<UrbanProjectUse>;

function UsesFloorSurfaceArea({ selectedUses, initialValues, onSubmit, onBack }: Props) {
  const usesWithBuildings = selectedUses.filter((use) => doesUseIncludeBuildings(use));

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout
      title="Quelle surface de plancher feront les différents bâtiments du projet urbain&nbsp;?"
      instructions={
        <FormInfo>
          <p>
            La surface de plancher correspond à la surface utile totale des bâtiments (tous étages
            confondus).
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {usesWithBuildings.map((use) => {
          return (
            <RowDecimalsNumericInput
              key={use}
              addonText={SQUARE_METERS_HTML_SYMBOL}
              label={getLabelForUrbanProjectUse(use)}
              hintText="En surface de plancher."
              imgSrc={getPictogramUrlForUrbanProjectUse(use)}
              nativeInputProps={register(use, requiredNumericFieldRegisterOptions)}
            />
          );
        })}
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default UsesFloorSurfaceArea;
