import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { typedObjectEntries } from "shared";
import { SiteFeatures } from "../domain/siteFeatures";

import { getLabelForExpensePurpose } from "@/features/create-site/domain/expenses.functions";
import { getFricheActivityLabel } from "@/features/create-site/domain/friche.types";
import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { sumList, sumObjectValues } from "@/shared/services/sum/sum";
import classNames from "@/shared/views/clsx";

type Props = SiteFeatures;

type DataLineProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};
function DataLine({ label, value, className = "fr-my-2w" }: DataLineProps) {
  return (
    <div className={classNames(className, "tw-flex", "tw-justify-between")}>
      <dd className="fr-p-0">{label}</dd>
      <dt className="tw-text-right">{value}</dt>
    </div>
  );
}

export default function SiteFeaturesList(siteFeatures: Props) {
  const siteManagementExpenses = siteFeatures.expenses.filter((e) =>
    ["rent", "propertyTaxes", "operationsTaxes", "otherManagementCosts"].includes(e.purpose),
  );
  const fricheSpecificExpenses = siteFeatures.expenses.filter((e) =>
    ["security", "maintenance", "illegalDumpingCost", "otherSecuringCosts"].includes(e.purpose),
  );
  return (
    <section className={classNames(fr.cx("fr-container"), "lg:tw-px-24", "tw-py-6")}>
      <Accordion label="Adresse" defaultExpanded>
        <dl>
          <DataLine label={<strong>Adresse du site</strong>} value={siteFeatures.address} />
        </dl>
      </Accordion>
      <Accordion label="Sols" defaultExpanded>
        <dl>
          <DataLine
            label={<strong>Superficie totale du site</strong>}
            value={<strong>{formatSurfaceArea(siteFeatures.surfaceArea)}</strong>}
            className="fr-mt-2w fr-mb-1w"
          />
        </dl>
        <dl className="fr-ml-2w">
          {typedObjectEntries(siteFeatures.soilsDistribution).map(([soilType, surfaceArea]) => {
            return (
              <DataLine
                label={getLabelForSoilType(soilType)}
                value={formatSurfaceArea(surfaceArea ?? 0)}
                key={soilType}
                className="fr-my-1w"
              />
            );
          })}
        </dl>
      </Accordion>
      {siteFeatures.isFriche && (
        <Accordion label="Pollution" defaultExpanded>
          <dl>
            <DataLine
              label={<strong>Superficie polluée</strong>}
              value={
                siteFeatures.contaminatedSurfaceArea
                  ? formatSurfaceArea(siteFeatures.contaminatedSurfaceArea)
                  : "Pas de pollution"
              }
            />
          </dl>
        </Accordion>
      )}
      <Accordion
        label={siteFeatures.isFriche ? "Gestion de la friche" : "Gestion du site"}
        defaultExpanded
      >
        <dl>
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
        </dl>
        {siteFeatures.isFriche && (
          <dl>
            <DataLine
              label={<strong>Accidents survenus sur le site depuis 5 ans</strong>}
              value={<strong>{sumObjectValues(siteFeatures.accidents) || "Aucun"}</strong>}
              className="fr-mt-2w fr-mb-1w"
            />
            {sumObjectValues(siteFeatures.accidents) > 0 && (
              <div className="fr-ml-2w">
                <DataLine
                  label="Blessés légers"
                  value={siteFeatures.accidents.minorInjuries ?? "Non renseigné"}
                  className="fr-my-1w"
                />
                <DataLine
                  label="Blessés graves"
                  value={siteFeatures.accidents.severyInjuries ?? "Non renseigné"}
                  className="fr-my-1w"
                />
                <DataLine
                  label="Tués"
                  value={siteFeatures.accidents.accidentsDeaths ?? "Non renseigné"}
                  className="fr-my-1w"
                />
              </div>
            )}
          </dl>
        )}
        <dl>
          <DataLine
            label={
              <strong>
                💸 Dépenses annuelles {siteFeatures.isFriche ? "de la friche" : "du site"}
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
            className="fr-mb-1w fr-mt-2w"
          />
          {siteManagementExpenses.length > 0 && (
            <>
              <p className={fr.cx("fr-ml-2w", "fr-my-1w", "fr-text--bold")}>Gestion du site</p>
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
              <p className={fr.cx("fr-ml-2w", "fr-my-1w", "fr-text--bold")}>Sécurisation du site</p>
              {fricheSpecificExpenses.map(({ amount, purpose }) => {
                return (
                  <DataLine
                    label={getLabelForExpensePurpose(purpose)}
                    value={`${formatNumberFr(amount)} €`}
                    className="fr-ml-4w fr-my-1w"
                    key={purpose}
                  />
                );
              })}
            </>
          )}
        </dl>
      </Accordion>
      <Accordion label="Dénomination" defaultExpanded>
        {siteFeatures.fricheActivity ? (
          <dl>
            <DataLine
              label={<strong>Type de friche</strong>}
              value={getFricheActivityLabel(siteFeatures.fricheActivity)}
            />
          </dl>
        ) : null}
        <dl>
          <DataLine label={<strong>Nom du site</strong>} value={siteFeatures.name} />
        </dl>
        <dl>
          <DataLine
            label={<strong>Description</strong>}
            value={siteFeatures.description || "Pas de description"}
          />
        </dl>
      </Accordion>
    </section>
  );
}
