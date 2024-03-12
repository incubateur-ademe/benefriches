import { ReactNode, useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { Project, ProjectSite } from "../../domain/projects.types";
import { ImpactCategoryFilter } from "../project-impacts-page/ProjectImpactsPage";
import ProjectsComparisonActionBar from "../shared/actions/ActionBar";
import CarbonEmissionComparisonChart from "./charts/carbon-emission/CarbonEmissionComparisonChart";
import CarbonStorageComparisonChart from "./charts/carbon-storage";
import EconomicEvaluationComparisonChart from "./charts/economic-evaluation";
import RentIncomeComparisonChart from "./charts/economic-impacts/RentIncomeComparisonChart";
import SecuringCostComparisonChart from "./charts/economic-impacts/SecuringCostComparisonChart";
import TaxRevenueComparisonChart from "./charts/economic-impacts/TaxRevenueComparisonChart";
import CarbonStorageEmissionFinancialImpactComparisonChart from "./charts/ecosystem-financial-impacts/CarbonStorageEmissionFinancialImpactComparisonChart";
import EnergyProductionCarbonEmissionFinancialImpactComparisonChart from "./charts/ecosystem-financial-impacts/EnergyProductionCarbonEmissionFinancialImpactComparisonChart";
import EnvironmentImpactComparisonChart from "./charts/ecosystem-financial-impacts/EnvironmentImpactComparisonChart";
import PollinationFinancialImpactComparisonChart from "./charts/ecosystem-financial-impacts/PollinationFinancialImpactComparisonChart";
import WaterCycleFinancialImpactComparison from "./charts/ecosystem-financial-impacts/WaterCycleFinancialImpactComparisonChart";
import WaterRegulationFinancialImpactComparisonChart from "./charts/ecosystem-financial-impacts/WaterRegulationFinancialImpactComparisonChart";
import FullTimeJobsComparisonChart from "./charts/full-time-jobs/FullTimeJobsComparisonChart";
import OperationsFullTimeJobsComparisonChart from "./charts/full-time-jobs/OperationsFullTimeJobsComparisonChart";
import ReconversionFullTimeJobsComparisonChart from "./charts/full-time-jobs/ReconversionFullTimeJobsComparisonChart";
import SocioEconomicBenefitsComparisonByDomainChart from "./charts/socioeconomic-benefits/SocioEconomicBenefitsComparisonByDomainChart";
import SocioEconomicBenefitsComparisonChart from "./charts/socioeconomic-benefits/SocioEconomicBenefitsComparisonChart";
import SocioEconomicImpactComparisonChart from "./charts/socioeconomic-impacts/SocioEconomicImpactComparison";
import NonPollutedSoilsImpactComparisonChart from "./charts/soil-impacts/NonPollutedSoilsImpactComparisonChart";
import PermeableSoilsImpactComparisonChart from "./charts/soil-impacts/PermeableSoilsImpactComparisonChart";
import ImpactsComparisonPageHeader from "./ImpactsComparisonHeader";

type SuccessDataProps = {
  loadingState: "success";
  baseScenario:
    | {
        type: "STATU_QUO";
        id: string;
        siteData: ProjectSite;
      }
    | {
        type: "PROJECT";
        id: string;
        projectData: Project;
        siteData: ProjectSite;
      };
  withScenario: {
    type: "PROJECT";
    id: string;
    projectData: Project;
    siteData: ProjectSite;
  };
};

type ErrorOrLoadingDataProps = {
  withScenario: undefined;
  baseScenario: undefined;
  loadingState: "idle" | "error" | "loading";
};

type Props = SuccessDataProps | ErrorOrLoadingDataProps;

type ImpactCardProps = {
  children: ReactNode;
};

const ImpactCard = ({ children }: ImpactCardProps) => {
  return (
    <div
      style={{ border: "3px solid #cccccc", borderRadius: "8px" }}
      className={fr.cx("fr-py-2w", "fr-px-2w")}
    >
      {children}
    </div>
  );
};

function ProjectsImpactsComparisonPage({ baseScenario, withScenario, loadingState }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<ImpactCategoryFilter>("all");

  if (loadingState === "loading") {
    return <p>Chargement en cours ...</p>;
  }

  if (loadingState === "error") {
    return (
      <Alert
        description="Une erreur s’est produite lors du chargement des données."
        severity="error"
        title="Erreur"
        className="fr-my-7v"
      />
    );
  }

  if (loadingState !== "success") {
    return null;
  }

  return (
    <div>
      <ImpactsComparisonPageHeader baseScenario={baseScenario} withScenario={withScenario} />
      <Notice
        title="Les indicateurs monétaires tiennent compte du coefficient d'actualisation sur la période sélectionnée."
        isClosable
        className={fr.cx("fr-mb-2w")}
      />
      <ProjectsComparisonActionBar
        selectedFilter={selectedFilter}
        onFilterClick={(clickedFilter: ImpactCategoryFilter) => {
          setSelectedFilter((currentFilter) =>
            currentFilter === clickedFilter ? "all" : clickedFilter,
          );
        }}
      />
      <div className={fr.cx("fr-mb-6w")}>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard>
              <EconomicEvaluationComparisonChart duration={10} />
            </ImpactCard>
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard>
              <SocioEconomicImpactComparisonChart />
            </ImpactCard>
          </div>
          {selectedFilter === "all" && (
            <>
              <div className={fr.cx("fr-col-3")}>
                <ImpactCard>
                  <FullTimeJobsComparisonChart />
                </ImpactCard>
              </div>
              <div className={fr.cx("fr-col-3")}>
                <ImpactCard>
                  <CarbonEmissionComparisonChart />
                </ImpactCard>
              </div>
            </>
          )}
        </div>

        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          {selectedFilter === "all" && (
            <div className={fr.cx("fr-col-6")}>
              <ImpactCard>
                <CarbonStorageComparisonChart />
              </ImpactCard>
            </div>
          )}
          <div className={fr.cx("fr-col-6")}>
            <ImpactCard>
              <SocioEconomicBenefitsComparisonChart />
            </ImpactCard>
          </div>
        </div>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col")}>
            <ImpactCard>
              <SocioEconomicBenefitsComparisonByDomainChart />
            </ImpactCard>
          </div>
        </div>
      </div>
      <div className={fr.cx("fr-mb-6w")}>
        <h4>Retombées économiques</h4>
        <p>Economies, bénéfices ou déficits réalisés une fois le site reconverti</p>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard>
              <RentIncomeComparisonChart />
            </ImpactCard>
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard>
              <TaxRevenueComparisonChart />
            </ImpactCard>
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard>
              <SecuringCostComparisonChart />
            </ImpactCard>
          </div>
        </div>
      </div>
      <div className={fr.cx("fr-mb-6w")}>
        <h4>Services écosystémiques</h4>
        <p>Monétarisation des services rendus à la société humaine par la nature et le projet</p>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard>
              <CarbonStorageEmissionFinancialImpactComparisonChart />
            </ImpactCard>
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard>
              <EnergyProductionCarbonEmissionFinancialImpactComparisonChart />
            </ImpactCard>
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard>
              <WaterRegulationFinancialImpactComparisonChart />
            </ImpactCard>
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard>
              <EnvironmentImpactComparisonChart />
            </ImpactCard>
          </div>
        </div>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard>
              <PollinationFinancialImpactComparisonChart />
            </ImpactCard>
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard>
              <WaterCycleFinancialImpactComparison />
            </ImpactCard>
          </div>
        </div>
      </div>
      {selectedFilter === "all" && (
        <>
          <div className={fr.cx("fr-mb-6w")}>
            <h4>Impacts sur les personnes</h4>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <div className={fr.cx("fr-col-3")}>
                <ImpactCard>
                  <ReconversionFullTimeJobsComparisonChart />
                </ImpactCard>
              </div>
              <div className={fr.cx("fr-col-3")}>
                <ImpactCard>
                  <OperationsFullTimeJobsComparisonChart />
                </ImpactCard>
              </div>
            </div>
          </div>
          <div className={fr.cx("fr-mb-6w")}>
            <h4>État des surfaces</h4>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <div className={fr.cx("fr-col-3")}>
                <ImpactCard>
                  <PermeableSoilsImpactComparisonChart />
                </ImpactCard>
              </div>
              <div className={fr.cx("fr-col-3")}>
                <ImpactCard>
                  <NonPollutedSoilsImpactComparisonChart />
                </ImpactCard>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectsImpactsComparisonPage;
