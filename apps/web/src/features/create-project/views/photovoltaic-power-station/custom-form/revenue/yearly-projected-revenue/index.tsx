import { RecurringRevenue } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVYearlyProjectedRevenueViewData } from "@/features/create-project/core/renewable-energy/step-handlers/revenue/revenue-yearly-projected/revenueYearlyProjected.selector";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { getLabelForRecurringRevenueSource } from "@/shared/core/reconversionProject";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import ProjectYearlyRevenueForm from "@/shared/views/project-form/common/revenues/yearly-projected-revenue/ProjectYearlyRevenueForm";

const fields = ["operations", "other"] as const;

function YearlyProjectedRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, photovoltaicExpectedAnnualProduction } = useAppSelector(
    selectPVYearlyProjectedRevenueViewData,
  );

  return (
    <ProjectYearlyRevenueForm
      title="Recettes annuelles"
      getFieldLabel={getLabelForRecurringRevenueSource}
      fields={fields}
      instructions={
        <FormInfo>
          <p>
            Les montants sont exprimés en <strong>€ HT</strong>.
          </p>
          <p>
            Les montants pré-remplis le sont d'après la production annuelle attendue de la centrale
            que vous avez renseigné ({formatNumberFr(photovoltaicExpectedAnnualProduction ?? 0)} en
            MWh/an) et les dépenses moyennes observées.
          </p>
          <p>
            <strong>Source&nbsp;: </strong>
            <br />
            <ExternalLink href="https://www.cre.fr/documents/Publications/Rapports-thematiques/Couts-et-rentabilites-du-grand-photovoltaique-en-metropole-continentale">
              Commission de régulation de l'énergie
            </ExternalLink>
          </p>
          <p>Vous pouvez modifier ces montants.</p>
        </FormInfo>
      }
      initialValues={{
        operations: initialValues.operations,
        other: initialValues.other,
      }}
      onBack={() => {
        dispatch(navigateToPrevious());
      }}
      onSubmit={(formData) => {
        const yearlyProjectedRevenues: RecurringRevenue[] = [];
        for (const field of fields) {
          if (formData[field]) {
            yearlyProjectedRevenues.push({
              source: field,
              amount: formData[field],
            });
          }
        }
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
            answers: { yearlyProjectedRevenues },
          }),
        );
      }}
    />
  );
}

export default YearlyProjectedRevenueFormContainer;
