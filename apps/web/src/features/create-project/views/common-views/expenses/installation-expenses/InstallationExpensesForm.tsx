import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  title: ReactNode;
  instructions?: ReactNode;
  labels?: {
    worksAmount?: string;
    technicalStudyAmount?: string;
    otherAmount?: string;
  };
};

export type FormValues = {
  worksAmount?: number;
  technicalStudyAmount?: number;
  otherAmount?: number;
};

const InstallationExpensesForm = ({
  onSubmit,
  onBack,
  initialValues,
  title,
  instructions,
  labels,
}: Props) => {
  const { handleSubmit, register, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const allExpenses = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title={title} instructions={instructions}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowDecimalsNumericInput
          addonText="€"
          className="!tw-pt-4"
          label={labels?.worksAmount ?? "Travaux d'installation"}
          nativeInputProps={register("worksAmount", optionalNumericFieldRegisterOptions)}
        />
        <RowDecimalsNumericInput
          addonText="€"
          className="!tw-pt-4"
          label={labels?.technicalStudyAmount ?? "Études et honoraires techniques"}
          nativeInputProps={register("technicalStudyAmount", optionalNumericFieldRegisterOptions)}
        />
        <RowDecimalsNumericInput
          addonText="€"
          className="!tw-pt-4"
          label={labels?.otherAmount ?? "Autres dépenses d'installation"}
          nativeInputProps={register("otherAmount", optionalNumericFieldRegisterOptions)}
        />

        {!hasNoValuesFilled && (
          <p>
            <strong>
              Total des dépenses d'installation : {formatNumberFr(sumObjectValues(allExpenses))} €
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

export default InstallationExpensesForm;
