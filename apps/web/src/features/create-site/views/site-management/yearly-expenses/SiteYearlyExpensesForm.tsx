import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type YearlyExpenseBearer = "owner" | "tenant";

export type FormValues = {
  rent: { amount?: number };
  propertyTaxes: { amount?: number };
  otherTaxes: { amount?: number };
  otherManagementCosts: { amount?: number };
  security: { amount?: number; bearer?: YearlyExpenseBearer };
  accidentsCost: { amount?: number };
  maintenance: { amount?: number; bearer?: YearlyExpenseBearer };
  illegalDumpingCost: { amount?: number; bearer?: YearlyExpenseBearer };
  otherSecuringCosts: { amount?: number; bearer?: YearlyExpenseBearer };
};

type Props = {
  hasTenant: boolean;
  hasRecentAccidents: boolean;
  isFriche: boolean;
  onSubmit: (data: FormValues) => void;
};

const siteManagementInputs = [
  {
    name: "rent",
    label: "Loyer",
    displayOnlyIfHasTenant: true,
    askForBearer: false,
  },
  {
    name: "propertyTaxes",
    label: "Taxe foncière",
    displayOnlyIfHasTenant: false,
    askForBearer: false,
  },
  {
    name: "otherTaxes",
    label: "Autre charge fiscale",
    displayOnlyIfHasTenant: true,
    askForBearer: false,
  },
  {
    name: "otherManagementCosts",
    label: "Autres coûts de gestion",
    displayOnlyIfHasTenant: false,
    askForBearer: true,
  },
] as const;

const siteSecuringInputs = [
  {
    name: "security",
    label: "Gardiennage",
    askForBearer: true,
    displayIfHasRecentAccidents: false,
  },
  {
    name: "maintenance",
    label: "Entretien",
    askForBearer: false,
    displayIfHasRecentAccidents: false,
  },
  {
    name: "illegalDumpingCost",
    label: "Débarras de dépôt sauvage",
    askForBearer: true,
    displayIfHasRecentAccidents: false,
  },
  {
    name: "accidentsCost",
    label: "Accidents",
    askForBearer: false,
    displayIfHasRecentAccidents: true,
  },
  {
    name: "otherSecuringCosts",
    label: "Autres coûts de sécurisation",
    askForBearer: true,
    displayIfHasRecentAccidents: false,
  },
] as const;

const expenseBearerOptions = [
  { label: "A la charge de l'exploitant", value: "tenant" },
  { label: "A la charge du propriétaire", value: "owner" },
];

function SiteYearlyExpensesForm({ onSubmit, hasTenant, isFriche, hasRecentAccidents }: Props) {
  const { handleSubmit, control, watch, register } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const title = `Coûts annuels ${isFriche ? "de la friche" : "du site"}`;

  return (
    <WizardFormLayout
      title={title}
      instructions={
        <>
          <p>Les coûts liés au projet sur site seront saisis dans une étape ultérieure.</p>
          <p>
            Les montants pré-remplis le sont d’après les informations que vous avez renseignéés et
            les coûts moyens en France de chaque poste de dépense.
          </p>
          <p>Vous pouvez modifier ces montants.</p>
          <p>
            Sauf en cas de défaillance de l’exploitant (faillite...), les coûts de gardiennage,
            d’entretien, de débarras de dépôt sauvage sont habituellement à la charge de
            l’exploitant.
          </p>
          <p>Les montants sont à saisir en HT (hors taxe).</p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Gestion du site</h3>
        {siteManagementInputs.map(({ name, label, displayOnlyIfHasTenant, askForBearer }) => {
          if (displayOnlyIfHasTenant && !hasTenant) {
            return null;
          }
          return (
            <>
              <NumericInput
                name={`${name}.amount`}
                key={name}
                label={label}
                hintText="€ / an"
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: "Veuillez sélectionner un montant valide",
                  },
                }}
              />
              {askForBearer && hasTenant && !!watch(`${name}.amount`) && (
                <RadioButtons
                  {...register(`${name}.bearer` as keyof FormValues)}
                  options={expenseBearerOptions}
                />
              )}
            </>
          );
        })}
        <h3>Sécurisation du site</h3>
        {siteSecuringInputs.map(({ name, label, askForBearer, displayIfHasRecentAccidents }) => {
          if (displayIfHasRecentAccidents && !hasRecentAccidents) return null;
          return (
            <>
              <NumericInput
                name={`${name}.amount`}
                key={name}
                label={label}
                hintText="€ / an"
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: "Veuillez sélectionner un montant valide",
                  },
                }}
              />
              {askForBearer && hasTenant && !!watch(`${name}.amount`) && (
                <RadioButtons {...register(`${name}.bearer`)} options={expenseBearerOptions} />
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

export default SiteYearlyExpensesForm;
