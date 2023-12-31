import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { SiteDraft } from "@/features/create-site/domain/siteFoncier.types";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type ExpensesBearer = SiteDraft["yearlyExpenses"][number]["bearer"];

export type FormValues = {
  securityExpenses?: number;
  securityExpensesBearer?: ExpensesBearer;
  accidentsExpenses?: number;
  maintenanceExpenses?: number;
  illegalDumpingExpenses?: number;
  illegalDumpingExpensesBearer?: ExpensesBearer;
  otherExpenses?: number;
  otherExpensesBearer?: ExpensesBearer;
};

type Props = {
  hasTenant: boolean;
  onSubmit: (data: FormValues) => void;
};

const inputs = [
  {
    name: "securityExpenses",
    label: "Gardiennage",
    askForBearer: true,
  },
  {
    name: "accidentsExpenses",
    label: "Entretien",
    askForBearer: false,
  },
  {
    name: "maintenanceExpenses",
    label: "Débarras de dépôt sauvage",
    askForBearer: true,
  },
  {
    name: "illegalDumpingExpenses",
    label: "Accidents",
    askForBearer: false,
  },
  { name: "otherExpenses", label: "Autres frais", askForBearer: true },
] as const;

const expenseBearerOptions = [
  { label: "A la charge de l'exploitant", value: "tenant" },
  { label: "A la charge du propriétaire", value: "owner" },
];

function FricheSecuringExpensessForm({ onSubmit, hasTenant }: Props) {
  const { register, control, handleSubmit, watch } = useForm<FormValues>();

  return (
    <WizardFormLayout
      title="Coûts annuels liés à la sécurisation de la friche"
      instructions={
        <p>
          Sauf en cas de défaillance de l’exploitant (faillite...), les coûts de gardiennage,
          d’entretien, de débarras de dépôt sauvage sont habituellement à la charge de l’exploitant.
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {inputs.map(({ name, label, askForBearer }) => {
          return (
            <>
              <NumericInput
                control={control}
                label={label}
                hintText="€ / an"
                name={name}
                key={name}
                rules={{
                  min: {
                    value: 0,
                    message: "Veuillez sélectionner un montant valide",
                  },
                }}
              />
              {askForBearer && hasTenant && !!watch(name) && (
                <RadioButtons
                  {...register(`${name}Bearer` as keyof FormValues)}
                  options={expenseBearerOptions}
                />
              )}
            </>
          );
        })}
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </WizardFormLayout>
  );
}

export default FricheSecuringExpensessForm;
