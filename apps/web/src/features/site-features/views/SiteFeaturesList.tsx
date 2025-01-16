import { sumListWithKey, typedObjectEntries, sumObjectValues } from "shared";

import { getLabelForExpensePurpose } from "@/features/create-site/core/expenses.functions";
import { getFricheActivityLabel } from "@/features/create-site/core/friche.types";
import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import classNames from "@/shared/views/clsx";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";
import SoilTypeLabelWithColorSquare from "@/shared/views/components/FeaturesList/FeaturesListSoilTypeLabel";

import { SiteFeatures } from "../core/siteFeatures";

type Props = SiteFeatures;

export default function SiteFeaturesList(siteFeatures: Props) {
  const siteManagementExpenses = siteFeatures.expenses.filter((e) =>
    ["rent", "propertyTaxes", "operationsTaxes", "otherManagementCosts"].includes(e.purpose),
  );
  const fricheSpecificExpenses = siteFeatures.expenses.filter((e) =>
    ["security", "maintenance", "illegalDumpingCost", "otherSecuringCosts"].includes(e.purpose),
  );
  return (
    <>
      <Section title="📍 Localisation">
        <DataLine label={<strong>Adresse du site</strong>} value={siteFeatures.address} />
      </Section>
      <Section title="🌾️ Sols">
        <DataLine
          noBorder
          label={<strong>Superficie totale du site</strong>}
          value={<strong>{formatSurfaceArea(siteFeatures.surfaceArea)}</strong>}
        />

        <div className="tw-grid tw-grid-cols-12">
          <div
            className={classNames(
              "tw-col-span-12",
              "md:tw-col-span-3",
              "tw-border-0",
              "tw-border-solid",
              "tw-border-l-black",
              "tw-border-l",
            )}
          >
            <SurfaceAreaPieChart
              soilsDistribution={siteFeatures.soilsDistribution}
              customHeight="200px"
              noLabels
            />
          </div>

          <div
            className={classNames(
              "tw-col-span-12",
              "md:tw-col-span-9",
              "tw-border-0",
              "tw-border-solid",
              "tw-border-l-black",
              "tw-border-l",
              "md:tw-border-0",
              "tw-pl-2",
              "md:tw-pl-0",
            )}
          >
            {typedObjectEntries(siteFeatures.soilsDistribution).map(([soilType, surfaceArea]) => {
              return (
                <DataLine
                  noBorder
                  label={<SoilTypeLabelWithColorSquare soilType={soilType} />}
                  value={formatSurfaceArea(surfaceArea ?? 0)}
                  key={soilType}
                  className="md:tw-grid-cols-[5fr_4fr]"
                />
              );
            })}
          </div>
        </div>
      </Section>
      {siteFeatures.isFriche && (
        <>
          <Section title="☣️ Pollution">
            <DataLine
              label={<strong>Superficie polluée</strong>}
              value={
                siteFeatures.contaminatedSurfaceArea
                  ? formatSurfaceArea(siteFeatures.contaminatedSurfaceArea)
                  : "Pas de pollution"
              }
            />
          </Section>
          <Section title="💥 Accidents">
            <>
              <DataLine
                label={<strong>Accidents survenus sur le site depuis 5 ans</strong>}
                value={<strong>{sumObjectValues(siteFeatures.accidents) || "Aucun"}</strong>}
              />
              {sumObjectValues(siteFeatures.accidents) > 0 && (
                <div className="tw-ml-4">
                  <DataLine
                    label="Blessés légers"
                    value={siteFeatures.accidents.minorInjuries ?? "Non renseigné"}
                  />
                  <DataLine
                    label="Blessés graves"
                    value={siteFeatures.accidents.severyInjuries ?? "Non renseigné"}
                  />
                  <DataLine
                    label="Tués"
                    value={siteFeatures.accidents.accidentsDeaths ?? "Non renseigné"}
                  />
                </div>
              )}
            </>
          </Section>
        </>
      )}
      <Section title={siteFeatures.isFriche ? "⚙️ Gestion de la friche" : "⚙️ Gestion du site"}>
        <>
          <DataLine label={<strong>Propriétaire actuel</strong>} value={siteFeatures.ownerName} />
          {siteFeatures.tenantName && (
            <DataLine
              label={
                <strong>{siteFeatures.isFriche ? "Locataire actuel" : "Exploitant actuel"}</strong>
              }
              value={siteFeatures.tenantName}
            />
          )}
        </>
        <>
          <DataLine
            noBorder
            label={
              <strong>
                Dépenses annuelles {siteFeatures.isFriche ? "de la friche" : "du site"}
              </strong>
            }
            value={
              siteFeatures.expenses.length > 0 ? (
                <strong>{formatNumberFr(sumListWithKey(siteFeatures.expenses, "amount"))} €</strong>
              ) : (
                "Aucun"
              )
            }
          />
          {siteManagementExpenses.length > 0 && (
            <>
              <DataLine
                isDetails
                label={<strong>Gestion du site</strong>}
                value={`${sumListWithKey(siteManagementExpenses, "amount")} €`}
              />
              {siteManagementExpenses.map(({ purpose, amount }) => {
                return (
                  <DataLine
                    label={getLabelForExpensePurpose(purpose)}
                    value={`${formatNumberFr(amount)} €`}
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
                label={<strong>Sécurisation du site</strong>}
                value={`${sumListWithKey(fricheSpecificExpenses, "amount")} €`}
              />
              {fricheSpecificExpenses.map(({ amount, purpose }) => {
                return (
                  <DataLine
                    label={getLabelForExpensePurpose(purpose)}
                    value={`${formatNumberFr(amount)} €`}
                    isDetails
                    key={purpose}
                  />
                );
              })}
            </>
          )}
        </>
      </Section>
      <Section title="✍ Dénomination">
        {siteFeatures.fricheActivity ? (
          <DataLine
            label={<strong>Type de friche</strong>}
            value={getFricheActivityLabel(siteFeatures.fricheActivity)}
          />
        ) : null}
        <DataLine label={<strong>Nom du site</strong>} value={siteFeatures.name} />
        {siteFeatures.description && (
          <DataLine label={<strong>Description</strong>} value={siteFeatures.description} />
        )}
      </Section>
    </>
  );
}
