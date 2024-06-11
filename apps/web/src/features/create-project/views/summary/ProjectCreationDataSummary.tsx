import { ReactNode } from "react";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { SoilsDistribution, SoilType } from "shared";
import { Schedule } from "../../application/saveReconversionProject.action";
import {
  DevelopmentPlanCategory,
  FinancialAssistanceRevenue,
  getLabelForFinancialAssistanceRevenueSource,
  getLabelForPhotovoltaicInstallationCostPurpose,
  getLabelForRecurringCostPurpose,
  getLabelForRecurringRevenueSource,
  getLabelForReinstatementCostPurpose,
  PhotovoltaicInstallationCost,
  RecurringCost,
  RecurringRevenue,
  ReinstatementCost,
  RenewableEnergyDevelopmentPlanType,
} from "../../domain/project.types";
import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "../projectTypeLabelMapping";

import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { sumList } from "@/shared/services/sum/sum";
import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  projectData: {
    name: string;
    description?: string;
    developmentPlanCategory: DevelopmentPlanCategory;
    renewableEnergy: RenewableEnergyDevelopmentPlanType;
    photovoltaicElectricalPowerKWc: number;
    photovoltaicSurfaceArea: number;
    photovoltaicExpectedAnnualProduction: number;
    photovoltaicContractDuration: number;
    soilsDistribution: SoilsDistribution;
    futureOwner?: string;
    futureOperator?: string;
    projectDeveloper?: string;
    reinstatementContractOwner?: string;
    reinstatementFullTimeJobs?: number;
    conversionFullTimeJobs?: number;
    operationsFullTimeJobs?: number;
    realEstateTransactionTotalCost?: number;
    finanalAssistanceRevenues?: FinancialAssistanceRevenue[];
    reinstatementCosts?: ReinstatementCost[];
    photovoltaicPanelsInstallationCosts?: PhotovoltaicInstallationCost[];
    yearlyProjectedCosts: RecurringCost[];
    yearlyProjectedRevenues: RecurringRevenue[];
    reinstatementSchedule?: Partial<Schedule>;
    photovoltaticInstallationSchedule?: Partial<Schedule>;
    firstYearOfOperation?: number;
  };
  siteData: {
    surfaceArea: number;
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
function DataLine({ label, value, className = "" }: DataLineProps) {
  const classes = `fr-my-2w  ${className}`;
  return (
    <dl className={classNames(classes, "tw-flex", "tw-justify-between")}>
      <dd className="fr-p-0">{label}</dd>
      <dt className="tw-text-right">{value}</dt>
    </dl>
  );
}

type ScheduleDatesProps = {
  startDate?: Date;
  endDate?: Date;
};
function ScheduleDates({ startDate, endDate }: ScheduleDatesProps) {
  return (
    <span>
      {startDate?.toLocaleDateString() ?? "Non renseigné"} ➡️{" "}
      {endDate?.toLocaleDateString() ?? "Non renseigné"}
    </span>
  );
}

function ProjectCreationDataSummary({ projectData, siteData, onNext, onBack }: Props) {
  return (
    <>
      <WizardFormLayout
        title="Récapitulatif des données"
        instructions="Si des données sont erronées, vous pouvez revenir en arrière pour les modifier."
      >
        <Accordion label="Type de projet" defaultExpanded>
          <DataLine
            label={<strong>Type d'aménagement</strong>}
            value={getLabelForDevelopmentPlanCategory(projectData.developmentPlanCategory)}
          />
          <DataLine
            label={<strong>Type d'énergies renouvelables</strong>}
            value={getLabelForRenewableEnergyProductionType(projectData.renewableEnergy)}
          />
        </Accordion>
        <Accordion label="Panneaux photovoltaïques" defaultExpanded>
          <DataLine
            label={<strong>Puissance d'installation</strong>}
            value={`${formatNumberFr(projectData.photovoltaicElectricalPowerKWc)} kWc`}
          />
          <DataLine
            label={<strong>Superficie occupée par les panneaux</strong>}
            value={formatSurfaceArea(projectData.photovoltaicSurfaceArea)}
          />
          <DataLine
            label={<strong>Production annuelle attendue</strong>}
            value={`${formatNumberFr(projectData.photovoltaicExpectedAnnualProduction)} MWh / an`}
          />
          <DataLine
            label={<strong>Superficie occupée par les panneaux</strong>}
            value={`${formatNumberFr(projectData.photovoltaicContractDuration)} ans`}
          />
        </Accordion>
        <Accordion label="Répartition des sols" defaultExpanded>
          <DataLine
            label={<strong>Superficie totale du site</strong>}
            value={<strong>{formatSurfaceArea(siteData.surfaceArea)}</strong>}
            className="fr-mb-1w"
          />
          {Object.entries(projectData.soilsDistribution)
            .filter(([, surfaceArea]) => surfaceArea > 0)
            .map(([soilType, surfaceArea]) => {
              return (
                <DataLine
                  label={getLabelForSoilType(soilType as SoilType)}
                  value={formatSurfaceArea(surfaceArea)}
                  key={soilType}
                  className="fr-ml-2w"
                />
              );
            })}
        </Accordion>
        <Accordion label="Acteurs du projet" defaultExpanded>
          <DataLine
            label={<strong>Aménageur du site</strong>}
            value={projectData.projectDeveloper}
          />
          <DataLine
            label={<strong>Futur propriétaire du site</strong>}
            value={projectData.futureOwner ?? "Pas de changement de propriétaire"}
          />
          <DataLine
            label={<strong>Futur exploitant du site</strong>}
            value={projectData.futureOperator}
          />
          {projectData.reinstatementContractOwner && (
            <DataLine
              label={<strong>Maître d'ouvrage des travaux de remise en état de la friche</strong>}
              value={projectData.reinstatementContractOwner}
            />
          )}
          <strong className="fr-ml-2w">Emplois équivalent temps plein mobilisés</strong>
          {projectData.reinstatementFullTimeJobs && (
            <DataLine
              label="Remise en état de la friche"
              value={formatNumberFr(projectData.reinstatementFullTimeJobs)}
              className="fr-ml-2w"
            />
          )}
          {projectData.conversionFullTimeJobs && (
            <DataLine
              label="Installation des panneaux photovoltaïques"
              value={
                projectData.conversionFullTimeJobs
                  ? formatNumberFr(projectData.conversionFullTimeJobs)
                  : "Non renseigné"
              }
              className="fr-ml-2w"
            />
          )}
          <DataLine
            label="Exploitation du site reconverti"
            value={
              projectData.operationsFullTimeJobs
                ? formatNumberFr(projectData.operationsFullTimeJobs)
                : "Non renseigné"
            }
            className="fr-ml-2w"
          />
        </Accordion>
        <Accordion label="Coûts et recettes du projet" defaultExpanded>
          {projectData.realEstateTransactionTotalCost ? (
            <DataLine
              label={<strong>Prix de vente du site et droits de mutation</strong>}
              value={`${formatNumberFr(projectData.realEstateTransactionTotalCost)} €`}
            />
          ) : undefined}
          {!!projectData.finanalAssistanceRevenues && (
            <>
              <DataLine
                label={<strong>Aides financières aux travaux</strong>}
                value={
                  <strong>
                    {formatNumberFr(
                      sumList(projectData.finanalAssistanceRevenues.map((r) => r.amount)),
                    )}{" "}
                    €
                  </strong>
                }
                className="fr-mb-1w fr-mt-2w"
              />
              {projectData.finanalAssistanceRevenues.map(({ amount, source }) => {
                return (
                  <DataLine
                    label={getLabelForFinancialAssistanceRevenueSource(source)}
                    value={`${formatNumberFr(amount)} €`}
                    className="fr-ml-2w"
                    key={source}
                  />
                );
              })}
            </>
          )}
          {!!projectData.reinstatementCosts && (
            <>
              <DataLine
                label={<strong>Coûts de remise en état de la friche</strong>}
                value={
                  <strong>
                    {formatNumberFr(sumList(projectData.reinstatementCosts.map((r) => r.amount)))} €
                  </strong>
                }
                className="fr-mb-1w fr-mt-2w"
              />
              {projectData.reinstatementCosts.map(({ amount, purpose }) => {
                return (
                  <DataLine
                    label={getLabelForReinstatementCostPurpose(purpose)}
                    value={`${formatNumberFr(amount)} €`}
                    className="fr-ml-2w"
                    key={purpose}
                  />
                );
              })}
            </>
          )}
          {!!projectData.photovoltaicPanelsInstallationCosts && (
            <>
              <DataLine
                label={<strong>Coûts d'installation des panneaux photovoltaïques</strong>}
                value={
                  <strong>
                    {formatNumberFr(
                      sumList(projectData.photovoltaicPanelsInstallationCosts.map((r) => r.amount)),
                    )}{" "}
                    €
                  </strong>
                }
                className="fr-mb-1w fr-mt-2w"
              />
              {projectData.photovoltaicPanelsInstallationCosts.map(({ amount, purpose }) => {
                return (
                  <DataLine
                    label={getLabelForPhotovoltaicInstallationCostPurpose(purpose)}
                    value={`${formatNumberFr(amount)} €`}
                    className="fr-ml-2w"
                    key={purpose}
                  />
                );
              })}
            </>
          )}
          <DataLine
            label={<strong>Dépenses annuelles</strong>}
            value={
              <strong>
                {formatNumberFr(sumList(projectData.yearlyProjectedCosts.map((e) => e.amount)))} €
              </strong>
            }
            className="fr-mb-1w fr-mt-2w"
          />
          {projectData.yearlyProjectedCosts.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForRecurringCostPurpose(purpose)}
                value={`${formatNumberFr(amount)} €`}
                className="fr-ml-2w"
                key={purpose}
              />
            );
          })}
          <DataLine
            label={<strong>Recettes annuelles</strong>}
            value={
              <strong>
                {formatNumberFr(sumList(projectData.yearlyProjectedRevenues.map((e) => e.amount)))}{" "}
                €
              </strong>
            }
            className="fr-mb-1w fr-mt-2w"
          />
          {projectData.yearlyProjectedRevenues.map(({ amount, source }) => {
            return (
              <DataLine
                label={getLabelForRecurringRevenueSource(source)}
                value={`${formatNumberFr(amount)} €`}
                className="fr-ml-2w"
                key={source}
              />
            );
          })}
        </Accordion>
        <Accordion label="Calendrier" defaultExpanded>
          {siteData.isFriche && (
            <DataLine
              label={<strong>Travaux de remise en état de la friche</strong>}
              value={
                <ScheduleDates
                  startDate={projectData.reinstatementSchedule?.startDate}
                  endDate={projectData.reinstatementSchedule?.endDate}
                />
              }
            />
          )}
          {projectData.photovoltaticInstallationSchedule && (
            <DataLine
              label={<strong>Travaux d'installation des panneaux</strong>}
              value={
                <ScheduleDates
                  startDate={projectData.photovoltaticInstallationSchedule.startDate}
                  endDate={projectData.photovoltaticInstallationSchedule.endDate}
                />
              }
            />
          )}
          <DataLine
            label={<strong>Mise en service du site</strong>}
            value={projectData.firstYearOfOperation ?? "Non renseigné"}
          />
        </Accordion>
        <Accordion label="Dénomination" defaultExpanded>
          <DataLine label={<strong>Nom du projet</strong>} value={projectData.name} />
          <DataLine
            label={<strong>Description</strong>}
            value={projectData.description || "Pas de description"}
          />
        </Accordion>
        <div className="fr-mt-4w">
          <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
        </div>
      </WizardFormLayout>
    </>
  );
}

export default ProjectCreationDataSummary;
