import { useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import SustainableSoilsReinstatementInfoButton from "./SustainableSoilsReinstatementInfoButton";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  hasBuildings: boolean;
  hasProjectedDecontamination: boolean;
  hasImpermeableSoils: boolean;
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

const ReinstatementExpensesFormExplanation = ({
  hasProjectedDecontamination,
  hasImpermeableSurface,
}: {
  hasProjectedDecontamination: boolean;
  hasImpermeableSurface: boolean;
}) => {
  if (hasProjectedDecontamination) {
    if (hasImpermeableSurface) {
      return (
        <section>
          <p>
            Le site que vous allez aménager est une friche partiellement imperméable et
            partiellement polluée.
          </p>
          <p>
            Vous allez donc potentiellement engager des travaux de déconstruction (bâtiments
            obsolètes, désimperméabilisation de parking et voiries etc...) et des travaux de
            dépollution.
          </p>
        </section>
      );
    }
    return (
      <section>
        <p>Le site que vous allez aménager est une friche partiellement polluée.</p>
        <p>Vous allez engager des travaux de dépollution.</p>
      </section>
    );
  } else {
    if (hasImpermeableSurface) {
      return (
        <section>
          <p>Le site que vous allez aménager est une friche partiellement imperméable.</p>
          <p>
            Vous allez donc potentiellement engager des travaux de déconstruction (bâtiments
            obsolètes, désimperméabilisation de parking et voiries etc...)
          </p>
        </section>
      );
    }
    return (
      <section>
        <p>
          Le site que vous allez aménager est une friche. Vous allez donc potentiellement engager
          des travaux de remise en état pour la rendre exploitable.
        </p>
      </section>
    );
  }
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
  hasBuildings,
  hasImpermeableSoils,
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

  const hasImpermeableSurface = hasBuildings || hasImpermeableSoils;

  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout
      title="Dépenses de travaux de remise en état de la friche"
      instructions={
        <FormInfo>
          <p>
            Les montants sont exprimés en <strong>€ HT</strong>.
          </p>
          <p>
            Les montants pré-remplis le sont d'après les informations de surface que vous avez
            renseigné et les dépenses moyens observés. Vous pouvez modifier ces montants.
          </p>
          <ReinstatementExpensesFormExplanation
            hasProjectedDecontamination={hasProjectedDecontamination}
            hasImpermeableSurface={hasImpermeableSurface}
          />
        </FormInfo>
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
