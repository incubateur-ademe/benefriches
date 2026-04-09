import { useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import FormAutoInfo from "@/shared/views/layout/WizardFormLayout/FormAutoInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import SustainableSoilsReinstatementInfoButton from "./SustainableSoilsReinstatementInfoButton";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  hasProjectedDecontamination: boolean;
};

export type FormValues = {
  wasteCollectionAmount?: number;
  asbestosRemovalAmount?: number;
  demolitionAmount?: number;
  remediationAmount?: number;
  deimpermeabilizationAmount?: number;
  sustainableSoilsReinstatementAmount?: number;
  otherReinstatementExpenseAmount?: number;
};

const getExpensesInputs = (hasProjectedDecontamination: boolean) => {
  const expenses = [
    { name: "asbestosRemovalAmount", label: "Désamiantage" },
    { name: "remediationAmount", label: "Dépollution des sols" },
    { name: "demolitionAmount", label: "Déconstruction" },
    { name: "deimpermeabilizationAmount", label: "Désimperméabilisation" },
    { name: "wasteCollectionAmount", label: "Évacuation et traitement des déchets" },
    {
      name: "sustainableSoilsReinstatementAmount",
      label: (
        <>
          Restauration écologique des sols
          <SustainableSoilsReinstatementInfoButton />
        </>
      ),
    },
    { name: "otherReinstatementExpenseAmount", label: "Autres dépenses de remise en état" },
  ] as const;
  return !hasProjectedDecontamination
    ? expenses.filter(({ name }) => name !== "remediationAmount")
    : expenses;
};

const ReinstatementsExpensesForm = ({
  initialValues,
  onSubmit,
  onBack,
  hasProjectedDecontamination,
}: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
          wasteCollectionAmount: initialValues.wasteCollectionAmount ?? 0,
          asbestosRemovalAmount: initialValues.asbestosRemovalAmount ?? 0,
          demolitionAmount: initialValues.demolitionAmount ?? 0,
          remediationAmount: initialValues.remediationAmount ?? 0,
          deimpermeabilizationAmount: initialValues.deimpermeabilizationAmount ?? 0,
          sustainableSoilsReinstatementAmount:
            initialValues.sustainableSoilsReinstatementAmount ?? 0,
          otherReinstatementExpenseAmount: initialValues.otherReinstatementExpenseAmount ?? 0,
        }
      : undefined,
  });

  const allExpenses = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout
      title="Dépenses de travaux de remise en état de la friche"
      instructions={
        <FormAutoInfo>
          D’où viennent les montants préremplis ?
          <p>
            Montants calculés d’après les informations que vous avez renseigné et les dépenses
            financiers moyens en France de chaque poste de dépense.
          </p>
        </FormAutoInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {getExpensesInputs(hasProjectedDecontamination).map(({ label, name }) => (
          <FormRowNumericInput
            controller={{ name, control }}
            key={name}
            addonText="€"
            label={label}
          />
        ))}

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

export default ReinstatementsExpensesForm;
