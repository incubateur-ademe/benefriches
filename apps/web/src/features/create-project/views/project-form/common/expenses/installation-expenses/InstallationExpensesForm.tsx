import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
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
  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const allExpenses = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title={title} instructions={instructions}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRowNumericInput
          controller={{ name: "worksAmount", control }}
          addonText="€"
          className="pt-4!"
          label={labels?.worksAmount ?? "Travaux d'installation"}
        />
        <FormRowNumericInput
          controller={{ name: "technicalStudyAmount", control }}
          addonText="€"
          className="pt-4!"
          label={labels?.technicalStudyAmount ?? "Études et honoraires techniques"}
        />
        <FormRowNumericInput
          controller={{ name: "otherAmount", control }}
          addonText="€"
          className="pt-4!"
          label={labels?.otherAmount ?? "Autres dépenses d'installation"}
        />

        <RowNumericInput
          label={<span className="font-medium text-dsfr-text-label-grey">Total</span>}
          addonText="€"
          nativeInputProps={{
            value: new Intl.NumberFormat("fr-FR").format(sumObjectValues(allExpenses)),
          }}
          disabled
        />

        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={hasNoValuesFilled ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
};

export default InstallationExpensesForm;
