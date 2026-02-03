import {
  getFricheActivityLabel,
  sumListWithKey,
  sumObjectValues,
  typedObjectEntries,
} from "shared";

import { getLabelForExpensePurpose } from "@/features/create-site/core/expenses.functions";
import { getLabelForIncomeSource } from "@/features/create-site/core/incomes.functions";
import { SiteFeatures } from "@/features/sites/core/site.types";

import DataLine from "../components/DataLine";
import FeaturesSection from "../components/FeaturesSection";
import PdfPage from "../components/PdfPage";
import PdfPageTitle from "../components/PdfPageTitle";
import { useSectionLabel } from "../context";
import { formatMoneyPdf, formatSurfaceAreaPdf } from "../format";
import { pageIds } from "../pageIds";
import SoilsDistributionPdf from "../project-features/development-plan/SoilsDistributionPdf";

type Props = {
  siteFeatures: SiteFeatures;
};

export default function SiteFeaturesPdfPage({ siteFeatures }: Props) {
  const sectionLabel = useSectionLabel("site-features");

  const siteManagementExpenses = siteFeatures.expenses.filter((e) =>
    [
      "maintenance",
      "rent",
      "propertyTaxes",
      "operationsTaxes",
      "otherManagementCosts",
      "otherOperationsCosts",
    ].includes(e.purpose),
  );
  const fricheSpecificExpenses = siteFeatures.expenses.filter((e) =>
    ["security", "illegalDumpingCost", "otherSecuringCosts"].includes(e.purpose),
  );

  return (
    <>
      <PdfPage id={pageIds["site-features"]}>
        <PdfPageTitle>{sectionLabel}</PdfPageTitle>
        <FeaturesSection title="📍 Localisation">
          <DataLine
            label="Adresse du site"
            labelClassName="font-bold"
            value={siteFeatures.address}
          />
        </FeaturesSection>
        <FeaturesSection title="🌾️ Sols">
          <SoilsDistributionPdf
            soilsDistribution={typedObjectEntries(siteFeatures.soilsDistribution).map(
              ([soilType, surfaceArea = 0]) => ({ soilType, surfaceArea }),
            )}
          />
        </FeaturesSection>
        {siteFeatures.nature === "FRICHE" && (
          <>
            <FeaturesSection title="☣️ Pollution">
              <DataLine
                label="Superficie polluée"
                labelClassName="font-bold"
                value={
                  siteFeatures.contaminatedSurfaceArea
                    ? formatSurfaceAreaPdf(siteFeatures.contaminatedSurfaceArea)
                    : "Pas de pollution déclarée"
                }
              />
            </FeaturesSection>
            <FeaturesSection title="💥 Accidents">
              <>
                <DataLine
                  label="Accidents survenus sur le site depuis 5 ans"
                  value={sumObjectValues(siteFeatures.accidents) || "Aucun"}
                  labelClassName="font-bold"
                />
                {sumObjectValues(siteFeatures.accidents) > 0 && (
                  <div className="ml-4">
                    <DataLine
                      label="Blessés légers"
                      value={siteFeatures.accidents.minorInjuries ?? "Non renseigné"}
                    />
                    <DataLine
                      label="Blessés graves"
                      value={siteFeatures.accidents.severeInjuries ?? "Non renseigné"}
                    />
                    <DataLine
                      label="Tués"
                      value={siteFeatures.accidents.accidentsDeaths ?? "Non renseigné"}
                    />
                  </div>
                )}
              </>
            </FeaturesSection>
          </>
        )}
      </PdfPage>
      <PdfPage>
        <FeaturesSection
          title={(() => {
            switch (siteFeatures.nature) {
              case "AGRICULTURAL_OPERATION":
                return "⚙️ Exploitation du site";
              case "FRICHE":
                return "⚙️ Gestion et sécurisation de la friche";
              case "NATURAL_AREA":
                return "⚙️ Gestion du site";
              default:
                return "Inconnu";
            }
          })()}
        >
          <>
            <DataLine
              label="Propriétaire actuel"
              labelClassName="font-bold"
              value={siteFeatures.ownerName}
            />
            {siteFeatures.tenantName && (
              <DataLine
                label={siteFeatures.nature === "FRICHE" ? "Locataire actuel" : "Exploitant actuel"}
                labelClassName="font-bold"
                value={siteFeatures.tenantName}
              />
            )}
          </>
          <>
            {siteFeatures.expenses.length > 0 && (
              <DataLine
                noBorder
                label={`Dépenses annuelles ${siteFeatures.nature === "FRICHE" ? "de la friche" : "du site"}`}
                value={formatMoneyPdf(sumListWithKey(siteFeatures.expenses, "amount"))}
                bold
              />
            )}
            {siteManagementExpenses.length > 0 && (
              <>
                {fricheSpecificExpenses.length > 0 && (
                  <DataLine isDetails label="Gestion du site" labelClassName="font-bold" value="" />
                )}
                {siteManagementExpenses.map(({ purpose, amount }) => {
                  return (
                    <DataLine
                      label={getLabelForExpensePurpose(purpose)}
                      value={formatMoneyPdf(amount)}
                      isDetails
                      key={purpose}
                    />
                  );
                })}
              </>
            )}
            {fricheSpecificExpenses.length > 0 && (
              <>
                <DataLine
                  isDetails
                  label="Sécurisation du site"
                  labelClassName="font-bold"
                  value=""
                />
                {fricheSpecificExpenses.map(({ amount, purpose }) => {
                  return (
                    <DataLine
                      label={getLabelForExpensePurpose(purpose)}
                      value={formatMoneyPdf(amount)}
                      isDetails
                      key={purpose}
                    />
                  );
                })}
              </>
            )}
            {siteFeatures.incomes.length > 0 && (
              <>
                <DataLine
                  noBorder
                  label="Recettes annuelles du site"
                  value={formatMoneyPdf(sumListWithKey(siteFeatures.incomes, "amount"))}
                  bold
                />
                {siteFeatures.incomes.map(({ source, amount }) => {
                  return (
                    <DataLine
                      label={getLabelForIncomeSource(source)}
                      value={formatMoneyPdf(amount)}
                      isDetails
                      key={source}
                    />
                  );
                })}
              </>
            )}
          </>
        </FeaturesSection>
        <FeaturesSection title="✍️ Dénomination">
          {siteFeatures.fricheActivity ? (
            <DataLine
              label="Type de friche"
              labelClassName="font-bold"
              value={getFricheActivityLabel(siteFeatures.fricheActivity)}
            />
          ) : null}
          <DataLine label="Nom du site" labelClassName="font-bold" value={siteFeatures.name} />
          {siteFeatures.description && (
            <DataLine
              label="Description"
              labelClassName="font-bold"
              value={siteFeatures.description}
            />
          )}
        </FeaturesSection>
      </PdfPage>
    </>
  );
}
