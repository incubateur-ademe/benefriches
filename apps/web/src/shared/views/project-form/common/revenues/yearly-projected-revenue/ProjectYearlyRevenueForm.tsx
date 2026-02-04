import { ReactNode } from "react";
import { DefaultValues, Path, useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type FormValues<Fields extends readonly string[]> = {
  [K in Fields[number]]: number;
};

type Props<Fields extends readonly string[]> = {
  title: string;
  getFieldLabel: (field: Fields[number]) => string;
  instructions?: ReactNode;
  fields: Fields;
  onSubmit: (data: FormValues<Fields>) => void;
  onBack: () => void;
  initialValues?: Partial<FormValues<Fields>>;
};

export default function ProjectYearlyRevenuesForm<Fields extends readonly string[]>({
  title,
  onSubmit,
  onBack,
  getFieldLabel,
  fields,
  initialValues,
  instructions,
}: Props<Fields>) {
  const { handleSubmit, control, watch } = useForm<FormValues<Fields>>({
    defaultValues: initialValues ? (initialValues as DefaultValues<FormValues<Fields>>) : undefined,
  });

  const allRevenues = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allRevenues).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title={title} instructions={instructions}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field) => {
          return (
            <FormRowNumericInput
              controller={{ name: field as Path<FormValues<Fields>>, control }}
              className="pt-4!"
              addonText="€ / an"
              label={getFieldLabel(field)}
              key={field}
            />
          );
        })}

        <RowNumericInput
          label={<span className="font-medium text-dsfr-text-label-grey">Total</span>}
          addonText="€"
          nativeInputProps={{
            value: new Intl.NumberFormat("fr-FR").format(sumObjectValues(allRevenues)),
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
}
