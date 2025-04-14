import { useForm } from "react-hook-form";
import { SiteYearlyIncome, typedObjectEntries } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<SiteYearlyIncome["source"], number | undefined>;

function SiteYearlyIncomeForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>();

  const formValues = watch();

  const hasNoValuesFilled =
    typedObjectEntries(formValues).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title="Recettes annuelles liées à l'exploitation">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowDecimalsNumericInput
          addonText="€ / an"
          label="Vente de produits"
          className="!tw-pt-4"
          nativeInputProps={register("product-sales", optionalNumericFieldRegisterOptions)}
        />

        <RowDecimalsNumericInput
          addonText="€ / an"
          label="Subventions"
          className="!tw-pt-4"
          nativeInputProps={register("subsidies", optionalNumericFieldRegisterOptions)}
        />

        <RowDecimalsNumericInput
          addonText="€ / an"
          label="Autres recettes"
          className="!tw-pt-4"
          nativeInputProps={register("other", optionalNumericFieldRegisterOptions)}
        />

        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={hasNoValuesFilled ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SiteYearlyIncomeForm;
