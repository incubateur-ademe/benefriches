import {
  DevelopmentPlanCategory,
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SoilsDistribution,
  SoilType,
  sumListWithKey,
} from "shared";

import { Schedule } from "@/features/create-project/core/project.types";
import { formatCarbonStorage } from "@/shared/core/format-number/formatCarbonStorage";
import {
  formatMoney,
  formatNumberFr,
  formatSurfaceArea,
} from "@/shared/core/format-number/formatNumber";
import {
  getLabelForFinancialAssistanceRevenueSource,
  getLabelForPhotovoltaicInstallationExpensePurpose,
  getLabelForRecurringExpense,
  getLabelForRecurringRevenueSource,
  getLabelForReinstatementExpensePurpose,
  RenewableEnergyDevelopmentPlanType,
} from "@/shared/core/reconversionProject";
import { SoilsCarbonStorageResult } from "@/shared/core/reducers/project-form/soilsCarbonStorage.action";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SoilsCarbonStorageChart from "@/shared/views/components/Charts/SoilsCarbonStorageChart";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import ScheduleDates from "@/shared/views/components/FeaturesList/FeaturesListScheduleDates";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";
import SoilTypeLabelWithColorSquare from "@/shared/views/components/FeaturesList/FeaturesListSoilTypeLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "../../projectTypeLabelMapping";

type Props = {
  projectData: {
    name: string;
    description?: string;
    decontaminatedSurfaceArea?: number;
    developmentPlanCategory: DevelopmentPlanCategory;
    renewableEnergy: RenewableEnergyDevelopmentPlanType;
    photovoltaicElectricalPowerKWc: number;
    photovoltaicSurfaceArea: number;
    photovoltaicExpectedAnnualProduction: number;
    photovoltaicContractDuration: number;
    soilsDistribution: SoilsDistribution;
    soilsCarbonStorage?: SoilsCarbonStorageResult;
    futureOwner?: string;
    futureOperator?: string;
    projectDeveloper?: string;
    reinstatementContractOwner?: string;
    sitePurchaseTotalCost?: number;
    financialAssistanceRevenues?: FinancialAssistanceRevenue[];
    reinstatementExpenses?: ReinstatementExpense[];
    photovoltaicPanelsInstallationExpenses?: PhotovoltaicInstallationExpense[];
    yearlyProjectedExpenses: RecurringExpense[];
    yearlyProjectedRevenues: RecurringRevenue[];
    reinstatementSchedule?: Schedule;
    photovoltaicInstallationSchedule?: Schedule;
    firstYearOfOperation?: number;
  };
  siteData: {
    surfaceArea: number;
    soilsDistribution: SoilsDistribution;
    soilsCarbonStorage?: SoilsCarbonStorageResult;
    name: string;
  };
  onNext: () => void;
  onBack: () => void;
};

function ProjectCreationDataSummary({ projectData, siteData, onNext, onBack }: Props) {
  return (
    <WizardFormLayout
      title="Récapitulatif du projet"
      instructions={
        <FormInfo>
          Si des données sont erronées, vous pouvez revenir en arrière pour les modifier.
        </FormInfo>
      }
    >
      <>
        <Section title="🏗️ Type de projet">
          <DataLine
            label={<strong>Type d'aménagement</strong>}
            value={getLabelForDevelopmentPlanCategory(projectData.developmentPlanCategory)}
          />
          <DataLine
            label={<strong>Type d'énergies renouvelables</strong>}
            value={getLabelForRenewableEnergyProductionType(projectData.renewableEnergy)}
          />
        </Section>
        <Section title="⚙️ Paramètres du projet">
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
            label={<strong>Durée du contrat de revente d'énergie</strong>}
            value={`${formatNumberFr(projectData.photovoltaicContractDuration)} ans`}
          />
        </Section>
        <Section title="🌾 Transformation des sols">
          {projectData.decontaminatedSurfaceArea ? (
            <DataLine
              label="Surface dépolluée"
              value={formatSurfaceArea(projectData.decontaminatedSurfaceArea)}
            />
          ) : null}
          <DataLine
            noBorder
            label={<strong>Nouvelle répartition des superficies</strong>}
            value={<strong>{formatSurfaceArea(siteData.surfaceArea)} de surface totale</strong>}
          />
          {Object.entries(projectData.soilsDistribution)
            .filter(([, surfaceArea]) => surfaceArea > 0)
            .map(([soilType, surfaceArea]) => {
              return (
                <DataLine
                  isDetails
                  label={<SoilTypeLabelWithColorSquare soilType={soilType as SoilType} />}
                  value={formatSurfaceArea(surfaceArea)}
                  key={soilType}
                />
              );
            })}
          <div className="flex gap-4 justify-between items-center py-4">
            <div className="border border-solid border-border-grey p-4 w-[50%]">
              <h3 className="uppercase text-base text-text-light">Site existant</h3>
              <SurfaceAreaPieChart
                soilsDistribution={siteData.soilsDistribution}
                mode="plain"
                customHeight="250px"
                exportConfig={{
                  subtitle: `${siteData.name} ${formatSurfaceArea(siteData.surfaceArea)}`,
                }}
              />
            </div>
            <span className="text-3xl">➔</span>
            <div className="border border-solid border-grey-dark p-4 w-[50%]">
              <h3 className="uppercase text-base">Site avec projet</h3>
              <SurfaceAreaPieChart
                soilsDistribution={projectData.soilsDistribution}
                mode="plain"
                customHeight="250px"
                exportConfig={{
                  subtitle: `${projectData.name} sur ${siteData.name} ${formatSurfaceArea(siteData.surfaceArea)}`,
                }}
              />
            </div>
          </div>

          {siteData.soilsCarbonStorage && projectData.soilsCarbonStorage ? (
            <>
              <DataLine
                label={<strong>Stockage du carbone dans les sols après aménagement</strong>}
                value={
                  <strong>
                    {formatCarbonStorage(
                      projectData.soilsCarbonStorage.totalCarbonStorage -
                        siteData.soilsCarbonStorage.totalCarbonStorage,
                    )}{" "}
                    T de carbone stocké
                  </strong>
                }
              />
              {projectData.soilsCarbonStorage.soilsStorage.map(({ type, carbonStorage }) => {
                return (
                  <DataLine
                    label={<SoilTypeLabelWithColorSquare soilType={type} />}
                    value={`${formatCarbonStorage(carbonStorage)} T`}
                    key={type}
                  />
                );
              })}
              <div className="flex gap-4 justify-between items-center py-4">
                <div className="border border-solid border-border-grey p-4 w-[50%]">
                  <h3 className="uppercase text-base text-text-light">Site existant</h3>
                  <SoilsCarbonStorageChart
                    soilsCarbonStorage={siteData.soilsCarbonStorage.soilsStorage}
                    mode="plain"
                    customHeight="250px"
                    exportConfig={{
                      title: "Stockage du carbone par les sols avant aménagement",
                      subtitle: siteData.name,
                      caption: `${formatCarbonStorage(siteData.soilsCarbonStorage.totalCarbonStorage)} T de carbone stocké`,
                    }}
                  />
                </div>
                <span className="text-3xl">➔</span>
                <div className="border border-solid border-grey-dark p-4 w-[50%]">
                  <h3 className="uppercase text-base">Site avec projet</h3>
                  <SoilsCarbonStorageChart
                    soilsCarbonStorage={projectData.soilsCarbonStorage.soilsStorage}
                    mode="plain"
                    customHeight="250px"
                    exportConfig={{
                      title: "Stockage du carbone par les sols après aménagement",
                      subtitle: `${projectData.name} sur ${siteData.name}`,
                      caption: `${formatCarbonStorage(projectData.soilsCarbonStorage.totalCarbonStorage)} T de carbone stocké`,
                    }}
                  />
                </div>
              </div>
            </>
          ) : null}
        </Section>
        <Section title="👱 Acteurs">
          <DataLine
            label={<strong>Aménageur du site</strong>}
            value={projectData.projectDeveloper ?? "Non renseigné"}
          />
          <DataLine
            label={<strong>Futur propriétaire du site</strong>}
            value={projectData.futureOwner ?? "Pas de changement de propriétaire"}
          />
          {projectData.futureOperator && (
            <DataLine
              label={<strong>Futur exploitant</strong>}
              value={projectData.futureOperator}
            />
          )}
          {projectData.reinstatementContractOwner && (
            <DataLine
              label={<strong>Maître d'ouvrage des travaux de remise en état de la friche</strong>}
              value={projectData.reinstatementContractOwner}
            />
          )}
        </Section>
        <Section title="💰 Dépenses et recettes du projet">
          {projectData.sitePurchaseTotalCost ? (
            <DataLine
              label={<strong>Prix de vente du site et droits de mutation</strong>}
              value={<strong>{formatMoney(projectData.sitePurchaseTotalCost)}</strong>}
            />
          ) : undefined}
          {!!projectData.reinstatementExpenses && (
            <>
              <DataLine
                noBorder
                label={<strong>Dépenses de remise en état de la friche</strong>}
                value={
                  <strong>
                    {formatMoney(sumListWithKey(projectData.reinstatementExpenses, "amount"))}
                  </strong>
                }
              />
              {projectData.reinstatementExpenses.map(({ amount, purpose }) => {
                return (
                  <DataLine
                    label={getLabelForReinstatementExpensePurpose(purpose)}
                    value={formatMoney(amount)}
                    isDetails
                    key={purpose}
                  />
                );
              })}
            </>
          )}
          {projectData.photovoltaicPanelsInstallationExpenses &&
            projectData.photovoltaicPanelsInstallationExpenses.length > 0 && (
              <>
                <DataLine
                  noBorder
                  label={<strong>Dépenses d'installation de la centrale photovoltaïque</strong>}
                  value={
                    <strong>
                      {formatMoney(
                        sumListWithKey(
                          projectData.photovoltaicPanelsInstallationExpenses,
                          "amount",
                        ),
                      )}
                    </strong>
                  }
                />
                {projectData.photovoltaicPanelsInstallationExpenses.map(({ amount, purpose }) => (
                  <DataLine
                    label={getLabelForPhotovoltaicInstallationExpensePurpose(purpose)}
                    value={formatMoney(amount)}
                    isDetails
                    key={purpose}
                  />
                ))}
              </>
            )}
          <DataLine
            noBorder
            label={<strong>Dépenses annuelles</strong>}
            value={
              <strong>
                {formatMoney(sumListWithKey(projectData.yearlyProjectedExpenses, "amount"))}
              </strong>
            }
          />
          {projectData.yearlyProjectedExpenses.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForRecurringExpense(purpose)}
                value={formatMoney(amount)}
                isDetails
                key={purpose}
              />
            );
          })}
          {!!projectData.financialAssistanceRevenues && (
            <>
              <DataLine
                noBorder
                label={<strong>Aides financières</strong>}
                value={
                  <strong>
                    {formatMoney(sumListWithKey(projectData.financialAssistanceRevenues, "amount"))}
                  </strong>
                }
              />
              {projectData.financialAssistanceRevenues.map(({ amount, source }) => {
                return (
                  <DataLine
                    label={getLabelForFinancialAssistanceRevenueSource(source)}
                    value={formatMoney(amount)}
                    isDetails
                    key={source}
                  />
                );
              })}
            </>
          )}
          <DataLine
            noBorder
            label={
              <div>
                <strong>Recettes annuelles</strong>
              </div>
            }
            value={
              <div>
                <strong>
                  {formatMoney(sumListWithKey(projectData.yearlyProjectedRevenues, "amount"))}
                </strong>
              </div>
            }
          />
          {projectData.yearlyProjectedRevenues.map(({ amount, source }) => {
            return (
              <DataLine
                label={getLabelForRecurringRevenueSource(source)}
                value={formatMoney(amount)}
                isDetails
                key={source}
              />
            );
          })}
        </Section>
        <Section title="📆 Calendrier">
          {projectData.reinstatementSchedule && (
            <DataLine
              label={<strong>Travaux de remise en état de la friche</strong>}
              value={
                <ScheduleDates
                  startDateString={projectData.reinstatementSchedule.startDate}
                  endDateString={projectData.reinstatementSchedule.endDate}
                />
              }
            />
          )}
          {projectData.photovoltaicInstallationSchedule && (
            <DataLine
              label={<strong>Travaux d'installation des panneaux</strong>}
              value={
                <ScheduleDates
                  startDateString={projectData.photovoltaicInstallationSchedule.startDate}
                  endDateString={projectData.photovoltaicInstallationSchedule.endDate}
                />
              }
            />
          )}
          <DataLine
            label={<strong>Mise en service du site</strong>}
            value={projectData.firstYearOfOperation ?? "Non renseigné"}
          />
        </Section>
        <Section title="✍️ Dénomination">
          <DataLine label={<strong>Nom du projet</strong>} value={projectData.name} />
          {projectData.description && (
            <DataLine label={<strong>Description</strong>} value={projectData.description} />
          )}
        </Section>
      </>
      <div className="mt-8">
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} nextLabel="Valider" />
      </div>
    </WizardFormLayout>
  );
}

export default ProjectCreationDataSummary;
