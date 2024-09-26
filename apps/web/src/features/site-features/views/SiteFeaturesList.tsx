import { typedObjectEntries } from "shared";
import { SiteFeatures } from "../domain/siteFeatures";

import { getLabelForExpensePurpose } from "@/features/create-site/domain/expenses.functions";
import { getFricheActivityLabel } from "@/features/create-site/domain/friche.types";
import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import { sumList, sumObjectValues } from "@/shared/services/sum/sum";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";
import SoilTypeLabelWithColorSquare from "@/shared/views/components/FeaturesList/FeaturesListSoilTypeLabel";

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
          label={<strong>Superficie totale du site</strong>}
          value={<strong>{formatSurfaceArea(siteFeatures.surfaceArea)}</strong>}
        />
        <div className="tw-flex tw-flex-col tw-items-center md:tw-items-start md:tw-flex-row md:tw-justify-between">
          <div className="md:tw-w-1/3">
            <SurfaceAreaPieChart
              soilsDistribution={siteFeatures.soilsDistribution}
              customHeight="200px"
              noLabels
            />
          </div>

          <div className="tw-w-full">
            {typedObjectEntries(siteFeatures.soilsDistribution).map(([soilType, surfaceArea]) => {
              return (
                <DataLine
                  label={<SoilTypeLabelWithColorSquare soilType={soilType} />}
                  value={formatSurfaceArea(surfaceArea ?? 0)}
                  key={soilType}
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
                <div className="fr-ml-2w">
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
          <DataLine
            label={<strong>Nombre d'emplois temps plein mobilisés sur le site</strong>}
            value={
              siteFeatures.fullTimeJobsInvolved
                ? formatNumberFr(siteFeatures.fullTimeJobsInvolved)
                : "Non renseigné"
            }
          />
        </>
        <>
          <DataLine
            label={
              <strong>
                Dépenses annuelles {siteFeatures.isFriche ? "de la friche" : "du site"}
              </strong>
            }
            value={
              siteFeatures.expenses.length > 0 ? (
                <strong>
                  {formatNumberFr(sumList(siteFeatures.expenses.map((e) => e.amount)))} €
                </strong>
              ) : (
                "Aucun"
              )
            }
          />
          {siteManagementExpenses.length > 0 && (
            <>
              <DataLine
                className="fr-ml-2w"
                label={<strong>Gestion du site</strong>}
                value={`${sumList(siteManagementExpenses.map(({ amount }) => amount))} €`}
              />
              {siteManagementExpenses.map(({ purpose, amount }) => {
                return (
                  <DataLine
                    label={getLabelForExpensePurpose(purpose)}
                    value={`${formatNumberFr(amount)} €`}
                    className="fr-ml-4w fr-ml-3v"
                    key={purpose}
                  />
                );
              })}
            </>
          )}
          {fricheSpecificExpenses.length > 0 && (
            <>
              <DataLine
                className="fr-ml-2w"
                label={<strong>Sécurisation du site</strong>}
                value={`${sumList(fricheSpecificExpenses.map(({ amount }) => amount))} €`}
              />
              {fricheSpecificExpenses.map(({ amount, purpose }) => {
                return (
                  <DataLine
                    label={getLabelForExpensePurpose(purpose)}
                    value={`${formatNumberFr(amount)} €`}
                    className="fr-ml-4w "
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
        <DataLine
          label={<strong>Description</strong>}
          value={siteFeatures.description || "Pas de description"}
        />
      </Section>
    </>
  );
}
