import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { roundToInteger, sumListWithKey } from "shared";

import { getProjectSummary } from "@/features/create-project/core/urban-project/helpers/projectSummary";
import { formatMoney } from "@/shared/core/format-number/formatNumber";
import {
  getLabelForFinancialAssistanceRevenueSource,
  getLabelForRecurringRevenueSource,
} from "@/shared/core/reconversionProject";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

type ProjectSummary = ReturnType<typeof getProjectSummary>;

type Props = {
  buttonProps?: ButtonProps;
  warning?: string;
  siteResaleExpectedSellingPrice: ProjectSummary["siteResaleExpectedSellingPrice"];
  buildingsResaleExpectedSellingPrice: ProjectSummary["buildingsResaleExpectedSellingPrice"];
  yearlyProjectedRevenues: ProjectSummary["yearlyProjectedRevenues"];
  financialAssistanceRevenues: ProjectSummary["financialAssistanceRevenues"];
  buildingsFloorSurfaceArea: ProjectSummary["buildingsFloorSurfaceArea"];
  developerName: string | undefined;
};

export default function UrbanProjectRevenuesSection({
  buttonProps,
  warning,
  siteResaleExpectedSellingPrice,
  buildingsResaleExpectedSellingPrice,
  yearlyProjectedRevenues,
  financialAssistanceRevenues,
  buildingsFloorSurfaceArea,
  developerName,
}: Props) {
  const hasRevenues =
    (siteResaleExpectedSellingPrice.shouldDisplay &&
      siteResaleExpectedSellingPrice.value !== undefined) ||
    (buildingsResaleExpectedSellingPrice.shouldDisplay &&
      buildingsResaleExpectedSellingPrice.value !== undefined) ||
    yearlyProjectedRevenues.value.length > 0 ||
    financialAssistanceRevenues.value !== undefined;

  if (!hasRevenues) {
    return (
      <Section title="💰 Recettes" buttonProps={buttonProps} warning={warning}>
        Aucune recette renseignée.
      </Section>
    );
  }

  return (
    <Section title="💰 Recettes" buttonProps={buttonProps} warning={warning}>
      {siteResaleExpectedSellingPrice.value && (
        <>
          <DataLine
            noBorder
            label={
              <>
                <strong>Cession du foncier aménagé</strong> (au bénéfice de {developerName})
              </>
            }
            value={<strong>{formatMoney(siteResaleExpectedSellingPrice.value)}</strong>}
          />
          {siteResaleExpectedSellingPrice.value && (
            <DataLine
              label="Prix de vente"
              value={formatMoney(siteResaleExpectedSellingPrice.value)}
              isDetails
              valueTooltip={
                siteResaleExpectedSellingPrice.isAuto &&
                buildingsFloorSurfaceArea.value &&
                siteResaleExpectedSellingPrice.value
                  ? `Le prix de revente du site est calculé sur la base de charges foncières estimées à ${roundToInteger(siteResaleExpectedSellingPrice.value / buildingsFloorSurfaceArea.value)} €/m²SDP de bâtiment. Cette valeur est issue du retour d'expérience ADEME.`
                  : undefined
              }
            />
          )}
        </>
      )}

      {buildingsResaleExpectedSellingPrice.value && (
        <>
          <DataLine
            noBorder
            label={
              <>
                <strong>Vente des bâtiments</strong> (au bénéfice de {developerName})
              </>
            }
            value={<strong>{formatMoney(buildingsResaleExpectedSellingPrice.value)}</strong>}
          />
          {buildingsResaleExpectedSellingPrice.value && (
            <DataLine
              label="Prix de vente"
              value={formatMoney(buildingsResaleExpectedSellingPrice.value)}
              isDetails
            />
          )}
        </>
      )}

      {yearlyProjectedRevenues.value.length > 0 && (
        <>
          <DataLine
            noBorder
            label={<strong>Recettes annuelles d'exploitation des bâtiments</strong>}
            value={
              <strong>
                {formatMoney(sumListWithKey(yearlyProjectedRevenues.value, "amount"))}
              </strong>
            }
          />
          {yearlyProjectedRevenues.value.map(({ amount, source }) => (
            <DataLine
              label={getLabelForRecurringRevenueSource(source)}
              value={formatMoney(amount)}
              isDetails
              key={source}
            />
          ))}
        </>
      )}

      {financialAssistanceRevenues.value && (
        <>
          <DataLine
            noBorder
            label={<strong>Aides financières</strong>}
            value={
              <strong>
                {formatMoney(sumListWithKey(financialAssistanceRevenues.value, "amount"))}
              </strong>
            }
          />
          {financialAssistanceRevenues.value.map(({ amount, source }) => (
            <DataLine
              label={getLabelForFinancialAssistanceRevenueSource(source)}
              value={formatMoney(amount)}
              isDetails
              key={source}
            />
          ))}
        </>
      )}
    </Section>
  );
}
