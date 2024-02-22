import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import SiteYearlyExpensesFormInstructions from "./SiteYearlyExpensesFormInstructions";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import TooltipInfoButton from "@/shared/views/components/TooltipInfoButton/TooltipInfoButton";
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
  defaultValues: {
    illegalDumpingCost?: { amount?: number };
    security?: { amount?: number };
    maintenance: { amount?: number };
  };
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
    label: "Autres charges fiscales",
    displayOnlyIfHasTenant: true,
    askForBearer: false,
  },
  {
    name: "maintenance",
    label: "Entretien",
    displayOnlyIfHasTenant: false,
    askForBearer: false,
  },
  {
    name: "otherManagementCosts",
    label: (
      <>
        Autres coûts de gestion
        <TooltipInfoButton
          text="Par exemple, le maintien de bâtiments en bon état (ex&nbsp;: chauffage pour éviter le gel
          de canalisation ou la dégradation liée l’humidité), la taille de la végétation ou encore
          le règlement des factures d’eau ou d’électricité."
          id="other-management-costs"
        />
      </>
    ),
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
    name: "illegalDumpingCost",
    label: (
      <>
        Débarras de dépôt sauvage
        <TooltipInfoButton
          text="L’enquête menée en 2019 par l’ADEME indique un ratio moyen de 4.7 kg/hab/an et un coût
          moyen de 900 €/tonne (Nb&nbsp;: bien qu’on relève une occurrence non négligeable de coûts
          plus élevés (500 à 1000 €/tonne voire supérieurs à 1000 €/tonne), qui peuvent être liés à
          des typologies de déchets particulières (déchets dangereux, encombrants) ou à des besoins
          de gestion (évacuation ou traitement) spécifiques, une majorité des valeurs répertoriées
          sont comprises entre 100 et 500 €/tonne)."
          id="illegal-dumping-cost"
        />
      </>
    ),

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
    label: (
      <>
        Autres coûts de sécurisation
        <TooltipInfoButton
          text="La sécurisation peut aussi passer, par exemple, par la mise en place de portail, clôture
          ou de cadenas, voire de protections sur les parties vitrées."
          id="other-security-costs"
        />
      </>
    ),
    askForBearer: true,
    displayIfHasRecentAccidents: false,
  },
] as const;

const expenseBearerOptions = [
  { label: "A la charge de l'exploitant", value: "tenant" },
  { label: "A la charge du propriétaire", value: "owner" },
];

function SiteYearlyExpensesForm({
  onSubmit,
  hasTenant,
  isFriche,
  hasRecentAccidents,
  defaultValues,
}: Props) {
  const { handleSubmit, control, watch, register } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues,
  });

  const title = `Coûts annuels ${isFriche ? "de la friche" : "du site"}`;

  return (
    <WizardFormLayout
      title={title}
      instructions={
        <SiteYearlyExpensesFormInstructions isFriche={isFriche} hasTenant={hasTenant} />
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
        {isFriche && (
          <>
            <h3>Sécurisation du site</h3>
            {siteSecuringInputs.map(
              ({ name, label, askForBearer, displayIfHasRecentAccidents }) => {
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
                      <RadioButtons
                        {...register(`${name}.bearer`)}
                        options={expenseBearerOptions}
                      />
                    )}
                  </>
                );
              },
            )}
          </>
        )}

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
