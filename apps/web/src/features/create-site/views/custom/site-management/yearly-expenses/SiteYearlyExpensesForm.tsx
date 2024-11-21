import { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";

import { getLabelForExpensePurpose } from "@/features/create-site/domain/expenses.functions";
import { Expense } from "@/features/create-site/domain/siteFoncier.types";
import {
  numberToString,
  stringToNumber,
} from "@/shared/services/number-conversion/numberConversion";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import TooltipInfoButton from "@/shared/views/components/TooltipInfoButton/TooltipInfoButton";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import SiteYearlyExpensesFormInstructions from "./SiteYearlyExpensesFormInstructions";

type YearlyExpenseBearer = "owner" | "tenant";
type FormExpense =
  | { amount?: undefined; bearer?: undefined }
  | { amount: number; bearer?: YearlyExpenseBearer };
export type FormValues = Partial<Record<Expense["purpose"], FormExpense>>;

export type Props = {
  hasTenant: boolean;
  isFriche: boolean;
  siteManagementExpensesWithBearer: { name: Expense["purpose"]; bearer?: "tenant" | "owner" }[];
  siteSecurityExpensesWithBearer: { name: Expense["purpose"]; bearer?: "tenant" | "owner" }[];
  defaultValues: {
    propertyTaxes?: { amount?: number };
    illegalDumpingCost?: { amount?: number };
    security?: { amount?: number };
    maintenance?: { amount?: number };
  };
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

const getLabelForExpense = (purpose: Expense["purpose"]) => {
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
            id="maintenance-costs-info"
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
            id="other-management-costs-info"
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
            id="security-costs-info"
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
            id="illegal-dumping-costs-info"
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
            id="other-security-costs-info"
          />
        </>
      );
  }
};

const getBearerLabel = (bearer: "tenant" | "owner", isFriche: boolean) => {
  if (bearer === "owner") {
    return "À la charge du propriétaire";
  }
  return isFriche ? "À la charge du locataire" : "À la charge de l’exploitant";
};

function SiteYearlyExpensesForm({
  onSubmit,
  onBack,
  siteManagementExpensesWithBearer,
  siteSecurityExpensesWithBearer,
  hasTenant,
  isFriche,
  defaultValues,
}: Props) {
  const { handleSubmit, control, watch, register, formState } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues,
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

        {siteManagementExpensesWithBearer.map(({ name, bearer }) => {
          return (
            <>
              <Controller
                key={name}
                control={control}
                name={`${name}.amount`}
                rules={{
                  min: {
                    value: 0,
                    message: "Veuillez sélectionner un montant valide",
                  },
                }}
                render={(controller) => {
                  return (
                    <ControlledRowNumericInput
                      controlProps={controller}
                      label={getLabelForExpense(name)}
                      hintText={
                        !hasTenant || bearer === undefined
                          ? undefined
                          : getBearerLabel(bearer, isFriche)
                      }
                      addonText="€ / an"
                    />
                  );
                }}
              />

              {bearer === undefined && !!watch(`${name}.amount`) && (
                <RadioButtons
                  error={formState.errors[name]?.bearer ?? undefined}
                  {...register(`${name}.bearer` as keyof FormValues, {
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
            {siteSecurityExpensesWithBearer.map(({ name, bearer }) => {
              return (
                <>
                  <Controller
                    key={name}
                    control={control}
                    name={`${name}.amount`}
                    rules={{
                      min: {
                        value: 0,
                        message: "Veuillez sélectionner un montant valide",
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <RowNumericInput
                          state={formState.errors[name]?.amount ? "error" : "default"}
                          stateRelatedMessage={
                            formState.errors[name]?.amount
                              ? formState.errors[name].amount.message
                              : undefined
                          }
                          nativeInputProps={{
                            name: field.name,
                            value: field.value ? numberToString(field.value) : undefined,
                            onChange: (ev: ChangeEvent<HTMLInputElement>) => {
                              field.onChange(stringToNumber(ev.target.value));
                            },
                            onBlur: field.onBlur,
                            type: "number",
                          }}
                          label={getLabelForExpense(name)}
                          hintText={
                            !hasTenant || bearer === undefined
                              ? undefined
                              : getBearerLabel(bearer, isFriche)
                          }
                          addonText="€ / an"
                        />
                      );
                    }}
                  />
                  {bearer === undefined && !!watch(`${name}.amount`) && (
                    <RadioButtons
                      error={formState.errors[name]?.bearer ?? undefined}
                      {...register(`${name}.bearer` as keyof FormValues, {
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
