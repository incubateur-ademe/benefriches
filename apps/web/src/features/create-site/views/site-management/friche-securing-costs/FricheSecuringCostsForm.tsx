import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { SiteFoncier } from "@/features/create-site/domain/siteFoncier.types";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";

type ExpensesBearer = SiteFoncier["yearlyExpenses"][number]["bearer"];

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
    <>
      <h2>Coûts annules liés à la sécurisation de la friche</h2>
      <p>
        Sauf en cas de défaillance de l’exploitant (faillite...), les coûts de
        gardiennage, d’entretien, de débarras de dépôt sauvage sont
        habituellement à la charge de l’exploitant.
      </p>
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
                rules={{ required: "Ce champ est requis" }}
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
    </>
  );
}

export default FricheSecuringExpensessForm;
