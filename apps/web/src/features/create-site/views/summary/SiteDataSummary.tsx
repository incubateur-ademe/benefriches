import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { getLabelForExpensePurpose } from "../../domain/expenses.functions";
import { FricheActivity, getFricheActivityLabel } from "../../domain/friche.types";
import { Expense } from "../../domain/siteFoncier.types";

import { SoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { sumList, sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  siteData: {
    address: string;
    ownerName: string;
    tenantName?: string;
    fullTimeJobsInvolved: number;
    accidents: {
      minorInjuries?: number;
      severyInjuries?: number;
      accidentsDeaths?: number;
    } | null;
    expenses: Expense[];
    totalSurfaceArea: number;
    soilsDistribution: Partial<Record<SoilType, number>>;
    contaminatedSurfaceArea?: number;
    fricheActivity?: FricheActivity;
    name: string;
    description?: string;
    isFriche: boolean;
  };
  onNext: () => void;
  onBack: () => void;
};

type DataLineProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};
function DataLine({ label, value, className = "fr-my-2w" }: DataLineProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }} className={className}>
      <dd className="fr-p-0">{label}</dd>
      <dt style={{ textAlign: "right" }}>{value}</dt>
    </div>
  );
}

function SiteDataSummary({ siteData, onNext, onBack }: Props) {
  return (
    <>
      <WizardFormLayout
        title="Récapitulatif des données"
        instructions="Si des données sont erronées, vous pouvez revenir en arrière pour les modifier."
      >
        <Accordion label="Adresse" defaultExpanded>
          <dl>
            <DataLine label={<strong>Adresse du site</strong>} value={siteData.address} />
          </dl>
        </Accordion>
        <Accordion
          label={siteData.isFriche ? "Gestion de la friche" : "Gestion du site"}
          defaultExpanded
        >
          <dl>
            <DataLine label={<strong>Propriétaire actuel</strong>} value={siteData.ownerName} />
            <DataLine
              label={<strong>Exploitant actuel</strong>}
              value={siteData.tenantName ?? "Pas d'exploitant"}
            />
            <DataLine
              label={<strong>Nombre d'emplois temps plein mobilisés sur le site</strong>}
              value={formatNumberFr(siteData.fullTimeJobsInvolved)}
            />
          </dl>
          {siteData.isFriche && (
            <dl>
              <DataLine
                label={<strong>Accidents survenus sur le site depuis 5 ans</strong>}
                value={
                  siteData.accidents ? (
                    <strong>{sumObjectValues(siteData.accidents)}</strong>
                  ) : (
                    "Aucun"
                  )
                }
                className="fr-mt-2w fr-mb-1w"
              />
              {siteData.accidents && (
                <div className="fr-ml-2w">
                  <DataLine
                    label="Blessés légers"
                    value={siteData.accidents.minorInjuries ?? 0}
                    className="fr-my-1w"
                  />
                  <DataLine
                    label="Blessés graves"
                    value={siteData.accidents.severyInjuries ?? 0}
                    className="fr-my-1w"
                  />
                  <DataLine
                    label="Tués"
                    value={siteData.accidents.accidentsDeaths ?? 0}
                    className="fr-my-1w"
                  />
                </div>
              )}
            </dl>
          )}

          <dl>
            <DataLine
              label={<strong>Coûts annuels du site</strong>}
              value={
                <strong>{formatNumberFr(sumList(siteData.expenses.map((e) => e.amount)))} €</strong>
              }
              className="fr-mb-1w fr-mt-2w"
            />
            <p className={fr.cx("fr-ml-2w", "fr-my-1w", "fr-text--bold")}>Gestion du site</p>
            {(["rent", "propertyTaxes", "operationsTaxes", "otherManagementCosts"] as const).map(
              (purpose) => {
                const amount =
                  siteData.expenses.find((exp) => exp.purpose === purpose)?.amount ?? 0;
                return (
                  <DataLine
                    label={getLabelForExpensePurpose(purpose)}
                    value={`${formatNumberFr(amount)} €`}
                    className="fr-ml-4w fr-ml-3v"
                    key={purpose}
                  />
                );
              },
            )}
            {siteData.isFriche && (
              <>
                <p className={fr.cx("fr-ml-2w", "fr-my-1w", "fr-text--bold")}>
                  Sécurisation du site
                </p>
                {(
                  ["security", "maintenance", "illegalDumpingCost", "otherSecuringCosts"] as const
                ).map((purpose) => {
                  const amount =
                    siteData.expenses.find((exp) => exp.purpose === purpose)?.amount ?? 0;
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
        <Accordion label="Sols" defaultExpanded>
          <dl>
            <DataLine
              label={<strong>Superficie totale du site</strong>}
              value={
                <strong>{`${formatNumberFr(siteData.totalSurfaceArea)} ${SQUARE_METERS_HTML_SYMBOL}`}</strong>
              }
              className="fr-mt-2w fr-mb-1w"
            />
          </dl>
          <dl className="fr-ml-2w">
            {Object.entries(siteData.soilsDistribution).map(([soilType, surfaceArea]) => {
              return (
                <DataLine
                  label={getLabelForSoilType(soilType as SoilType)}
                  value={`${formatNumberFr(surfaceArea)} ${SQUARE_METERS_HTML_SYMBOL}`}
                  key={soilType}
                  className="fr-my-1w"
                />
              );
            })}
          </dl>
        </Accordion>
        {siteData.isFriche && (
          <Accordion label="Pollution" defaultExpanded>
            <dl>
              <DataLine
                label={<strong>Superficie polluée</strong>}
                value={
                  siteData.contaminatedSurfaceArea
                    ? `${formatNumberFr(siteData.contaminatedSurfaceArea)} ${SQUARE_METERS_HTML_SYMBOL}`
                    : "Pas de pollution"
                }
              />
            </dl>
          </Accordion>
        )}

        <Accordion label="Dénomination" defaultExpanded>
          {siteData.fricheActivity ? (
            <dl>
              <DataLine
                label={<strong>Type de friche</strong>}
                value={getFricheActivityLabel(siteData.fricheActivity)}
              />
            </dl>
          ) : null}
          <dl>
            <DataLine label={<strong>Nom du site</strong>} value={siteData.name} />
          </dl>
          <dl>
            <DataLine
              label={<strong>Description</strong>}
              value={siteData.description || "Pas de description"}
            />
          </dl>
        </Accordion>
        <div className="fr-mt-4w">
          <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
        </div>
      </WizardFormLayout>
    </>
  );
}

export default SiteDataSummary;
