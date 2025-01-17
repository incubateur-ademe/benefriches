import { RecurringRevenue } from "shared";

import {
  completeYearlyProjectedRevenue,
  revertYearlyProjectedRevenue,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPhotovoltaicPowerStationYearlyRevenueInitialValues } from "@/features/create-project/core/renewable-energy/selectors/revenues.selectors";
import YearlyProjectedsRevenueForm from "@/features/create-project/views/common-views/revenues/yearly-projected-revenue";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

function YearlyProjectedRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectPhotovoltaicPowerStationYearlyRevenueInitialValues);
  const photovoltaicExpectedAnnualProduction = useAppSelector(
    (state) =>
      state.projectCreation.renewableEnergyProject.creationData
        .photovoltaicExpectedAnnualProduction,
  );

  return (
    <YearlyProjectedsRevenueForm
      instructions={
        <FormInfo>
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
        operationsAmount: initialValues.operations,
        otherAmount: initialValues.other,
      }}
      onBack={() => {
        dispatch(revertYearlyProjectedRevenue());
      }}
      onSubmit={(revenues: RecurringRevenue[]) => {
        dispatch(completeYearlyProjectedRevenue(revenues));
      }}
    />
  );
}

export default YearlyProjectedRevenueFormContainer;
