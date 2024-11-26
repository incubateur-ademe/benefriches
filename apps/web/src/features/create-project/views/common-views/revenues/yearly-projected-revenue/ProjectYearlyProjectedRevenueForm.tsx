import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  title?: ReactNode;
  instructions?: ReactNode;
  defaultValues?: {
    operationsAmount?: number;
  };
};

export type FormValues = {
  operationsAmount?: number;
  otherAmount?: number;
};

const ProjectYearlyProjectedRevenueForm = ({
  title = "Recettes annuelles",
  onSubmit,
  onBack,
  defaultValues,
  instructions,
}: Props) => {
  const { handleSubmit, register, watch } = useForm<FormValues>({ defaultValues });

  const allRevenues = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allRevenues).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title={title} instructions={instructions}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowDecimalsNumericInput
          className="!tw-pt-4"
          addonText="€ / an"
          label="Recettes d'exploitation"
          nativeInputProps={register("operationsAmount", optionalNumericFieldRegisterOptions)}
        />
        <RowDecimalsNumericInput
          className="!tw-pt-4"
          addonText="€ / an"
          label="Autres recettes"
          nativeInputProps={register("otherAmount", optionalNumericFieldRegisterOptions)}
        />

        {!hasNoValuesFilled && (
          <p>
            <strong>
              Total des recettes annuelles : {formatNumberFr(sumObjectValues(allRevenues))} €
            </strong>
          </p>
        )}

        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={hasNoValuesFilled ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
};

export default ProjectYearlyProjectedRevenueForm;
