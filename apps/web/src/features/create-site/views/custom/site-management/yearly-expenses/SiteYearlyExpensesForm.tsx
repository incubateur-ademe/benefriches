import { useForm } from "react-hook-form";
import { SiteYearlyExpensePurpose, typedObjectEntries } from "shared";

import {
  getLabelForExpensePurpose,
  SiteManagementYearlyExpensesBaseConfig,
  SiteSecurityYearlyExpensesBaseConfig,
} from "@/features/create-site/core/expenses.functions";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import TooltipInfoButton from "@/shared/views/components/TooltipInfoButton/TooltipInfoButton";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import SiteYearlyExpensesFormInstructions from "./SiteYearlyExpensesFormInstructions";

type YearlyExpenseBearer = "owner" | "tenant";
type FormExpense =
  | { amount?: undefined; bearer?: undefined }
  | { amount: number; bearer?: YearlyExpenseBearer };
export type FormValues = Partial<Record<SiteYearlyExpensePurpose, FormExpense>>;

type Props = {
  hasTenant: boolean;
  isFriche: boolean;
  siteManagementYearlyExpensesBaseConfig: SiteManagementYearlyExpensesBaseConfig;
  siteSecurityExpensesBaseConfig: SiteSecurityYearlyExpensesBaseConfig;
  initialValues: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

const getLabelForExpense = (purpose: SiteYearlyExpensePurpose) => {
  switch (purpose) {
    case "propertyTaxes":
    case "operationsTaxes":
    case "rent":
    case "accidentsCost":
      return getLabelForExpensePurpose(purpose);
    case "maintenance":
      return (
        <>
          {getLabelForExpensePurpose("maintenance")}
          <TooltipInfoButton
            text="Sauf en cas de défaillance de l'exploitant (faillite, liquidation judiciaire, etc.) les
      dépenses d'entretien sont à la charge de ce dernier."
            id="maintenance-expenses-info"
          />
        </>
      );
    case "otherManagementCosts":
      return (
        <>
          {getLabelForExpensePurpose("otherManagementCosts")}
          <TooltipInfoButton
            text="Par exemple, le maintien de bâtiments en bon état (ex&nbsp;: chauffage pour éviter le gel
          de canalisation ou la dégradation liée l'humidité), la taille de la végétation ou encore
          le règlement des factures d'eau ou d'électricité."
            id="other-management-expenses-info"
          />
        </>
      );
    case "security":
      return (
        <>
          {getLabelForExpensePurpose("security")}
          <TooltipInfoButton
            text="Sauf en cas de défaillance de l'exploitant (faillite, liquidation judiciaire, etc.) les
      dépenses de gardiennage sont à la charge de ce dernier."
            id="security-expenses-info"
          />
        </>
      );
    case "illegalDumpingCost":
      return (
        <>
          {getLabelForExpensePurpose("illegalDumpingCost")}
          <TooltipInfoButton
            text={
              <span>
                L'enquête menée en 2019 par l'ADEME indique un ratio moyen de 4,7 kg/hab/an et un
                coût moyen de 900 €/tonne (Nb&nbsp;: bien qu'on relève une occurrence non
                négligeable de dépenses plus élevées (500 à 1000 €/tonne voire supérieurs à 1000
                €/tonne), qui peuvent être liés à des typologies de déchets particulières (déchets
                dangereux, encombrants) ou à des besoins de gestion (évacuation ou traitement)
                spécifiques, une majorité des valeurs répertoriées sont comprises entre 100 et 500
                €/tonne).
                <br />
                <br />
                Sauf en cas de défaillance de l'exploitant (faillite, liquidation judiciaire, etc.)
                les dépenses de d'enlèvement de déchets sont à la charge de ce dernier.
              </span>
            }
            id="illegal-dumping-expenses-info"
          />
        </>
      );
    case "otherSecuringCosts":
      return (
        <>
          {getLabelForExpensePurpose("otherSecuringCosts")}
          <TooltipInfoButton
            text="La sécurisation peut aussi passer, par exemple, par la mise en place de portail, clôture
            ou de cadenas, voire de protections sur les parties vitrées."
            id="other-security-expenses-info"
          />
        </>
      );
  }
};

const getBearerLabel = (bearer: "tenant" | "owner", isFriche: boolean) => {
  if (bearer === "owner") {
    return "À la charge du propriétaire";
  }
  return isFriche ? "À la charge du locataire" : "À la charge de l'exploitant";
};

function SiteYearlyExpensesForm({
  onSubmit,
  onBack,
  siteManagementYearlyExpensesBaseConfig,
  siteSecurityExpensesBaseConfig,
  hasTenant,
  isFriche,
  initialValues,
}: Props) {
  const { handleSubmit, watch, register, formState } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: initialValues,
  });

  const expenseBearerOptions = [
    {
      label: getBearerLabel("tenant", isFriche),
      value: "tenant",
    },
    { label: getBearerLabel("owner", isFriche), value: "owner" },
  ];

  const title = `💸 Dépenses annuelles ${isFriche ? "de la friche" : "du site"}`;

  const formValues = watch();

  const hasNoValuesFilled =
    typedObjectEntries(formValues).filter(([, value]) => typeof value?.amount === "number")
      .length === 0;

  return (
    <WizardFormLayout title={title} instructions={<SiteYearlyExpensesFormInstructions />}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isFriche && <h3 className="!tw-mb-0">Gestion du site</h3>}

        {siteManagementYearlyExpensesBaseConfig.map(({ purpose, fixedBearer }) => {
          const amountEntered = !!formValues[purpose]?.amount;
          const askForBearer = fixedBearer === null && amountEntered;
          const bearerError = formState.errors[purpose]?.bearer;
          return (
            <>
              <RowDecimalsNumericInput
                key={`${purpose}.amount`}
                hintText={
                  fixedBearer && hasTenant ? getBearerLabel(fixedBearer, isFriche) : undefined
                }
                addonText="€ / an"
                label={getLabelForExpense(purpose)}
                nativeInputProps={register(
                  `${purpose}.amount`,
                  optionalNumericFieldRegisterOptions,
                )}
              />

              {askForBearer && (
                <RadioButtons
                  key={`${purpose}.bearer`}
                  error={bearerError}
                  {...register(`${purpose}.bearer`, {
                    required: "Cette information est obligatoire.",
                  })}
                  options={expenseBearerOptions}
                />
              )}
            </>
          );
        })}
        {isFriche && (
          <>
            <h3 className="!tw-mb-0 tw-mt-6">Sécurisation du site</h3>
            {siteSecurityExpensesBaseConfig.map(({ purpose, fixedBearer }) => {
              const amountEntered = !!formValues[purpose]?.amount;
              const askForBearer = fixedBearer === null && amountEntered;
              const amountError = formState.errors[purpose]?.amount;
              const bearerError = formState.errors[purpose]?.bearer;
              return (
                <>
                  <RowDecimalsNumericInput
                    key={`${purpose}.amount`}
                    state={amountError ? "error" : "default"}
                    stateRelatedMessage={amountError?.message}
                    nativeInputProps={register(
                      `${purpose}.amount`,
                      optionalNumericFieldRegisterOptions,
                    )}
                    label={getLabelForExpense(purpose)}
                    hintText={
                      hasTenant && fixedBearer ? getBearerLabel(fixedBearer, isFriche) : undefined
                    }
                    addonText="€ / an"
                  />
                  {askForBearer && (
                    <RadioButtons
                      key={`${purpose}.bearer`}
                      error={bearerError}
                      {...register(`${purpose}.bearer`, {
                        required: "Cette information est obligatoire.",
                      })}
                      options={expenseBearerOptions}
                    />
                  )}
                </>
              );
            })}
          </>
        )}

        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={hasNoValuesFilled ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SiteYearlyExpensesForm;
