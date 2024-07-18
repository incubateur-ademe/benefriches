import { Controller, useForm } from "react-hook-form";
import SustainableSoilsReinstatementInfoButton from "./SustainableSoilsReinstatementInfoButton";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  hasBuildings: boolean;
  hasContaminatedSoils: boolean;
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
  hasContaminatedSoils,
  hasImpermeableSurface,
}: {
  hasContaminatedSoils: boolean;
  hasImpermeableSurface: boolean;
}) => {
  if (hasContaminatedSoils) {
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
        <p>Vous allez donc potentiellement engager des travaux de dépollution.</p>
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

const getExpensesInputs = (hasContaminatedSoils: boolean) => {
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
  return hasContaminatedSoils
    ? expenses.filter(({ name }) => name !== "remediationAmount")
    : expenses;
};

const ReinstatementsExpensesForm = ({
  onSubmit,
  onBack,
  hasContaminatedSoils,
  hasBuildings,
  hasImpermeableSoils,
}: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allExpenses = watch();

  const hasImpermeableSurface = hasBuildings || hasImpermeableSoils;

  return (
    <WizardFormLayout
      title="Dépenses de travaux de remise en état de la friche"
      instructions={
        <FormInfo>
          <ReinstatementExpensesFormExplanation
            hasContaminatedSoils={hasContaminatedSoils}
            hasImpermeableSurface={hasImpermeableSurface}
          />
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {getExpensesInputs(hasContaminatedSoils).map(({ label, name }) => (
          <Controller
            key={name}
            control={control}
            name={name}
            rules={{
              min: {
                value: 0,
                message: "Veuillez entrer un montant valide",
              },
            }}
            render={(controller) => {
              return (
                <ControlledRowNumericInput
                  {...controller}
                  label={label}
                  hintInputText="€"
                  className="!tw-pt-4 !tw-mb-0"
                />
              );
            }}
          />
        ))}

        <p>
          <strong>
            Total des dépenses des travaux de remise en état :{" "}
            {formatNumberFr(sumObjectValues(allExpenses))} €
          </strong>
        </p>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
};

export default ReinstatementsExpensesForm;
