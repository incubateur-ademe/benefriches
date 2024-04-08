import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { ReconversionProjectImpacts } from "../../domain/impacts.types";
import CostBenefitAnalysisCard from "./impacts/cost-benefit-analysis/CostBenefitAnalysisCard";
import EconomicBalanceImpactCard from "./impacts/economic-balance/EconomicBalanceImpactCard";
import HouseholdsPoweredByRenewableEnergyImpactCard from "./impacts/environment/HouseholdsPoweredByRenewableEnergyImpactCard";
import ContaminatedSurfaceImpactChart from "./impacts/environment/NonContaminatedSurfaceImpactCard";
import PermeableSurfaceImpactChart from "./impacts/environment/PermeableSurfaceImpactCard";
import SoilsCarbonStorageImpactCard from "./impacts/environment/SoilsCarbonStorageImpactCard";
import StoredAndAvoidedCO2ImpactCard from "./impacts/environment/StoredAndAvoidedCO2ImpactCard";
import AccidentsImpactCard from "./impacts/social/AccidentsImpactCard";
import FullTimeJobsImpactCard from "./impacts/social/FullTimeJobsImpactCard";
import SocioEconomicImpactsCard from "./impacts/socio-economic/SocioEconomicImpactsCard";
import { ImpactDescriptionModalCategory } from "./modals/ImpactDescriptionModalWizard";

type Props = {
  project: {
    name: string;
  };
  impacts: ReconversionProjectImpacts;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const Row = ({ children }: { children: ReactNode }) => {
  return <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>{children}</div>;
};

const ImpactsChartsView = ({ project, impacts, openImpactDescriptionModal }: Props) => {
  return (
    <div>
      <section className={fr.cx("fr-pb-8v")}>
        <h3>Impacts économiques</h3>
        <div className="tw-grid tw-grid-rows-1 lg:tw-grid-rows-2 tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4">
          <div className="lg:tw-row-start-1 lg:tw-row-end-3">
            <CostBenefitAnalysisCard
              economicBalanceTotal={impacts.economicBalance.total}
              socioEconomicImpactsTotal={impacts.socioeconomic.total}
              onTitleClick={() => {
                openImpactDescriptionModal("cost-benefit-analysis");
              }}
            />
          </div>
          <div className="lg:tw-row-start-1">
            <EconomicBalanceImpactCard
              costs={impacts.economicBalance.costs}
              revenues={impacts.economicBalance.revenues}
              onTitleClick={() => {
                openImpactDescriptionModal("economic-balance");
              }}
            />
          </div>

          <div className="lg:tw-row-start-2">
            <SocioEconomicImpactsCard
              socioEconomicImpacts={impacts.socioeconomic.impacts}
              onTitleClick={() => {
                openImpactDescriptionModal("socio-economic");
              }}
            />
          </div>
        </div>
      </section>
      <section className={fr.cx("fr-pb-8v")}>
        <h3
          className="tw-cursor-pointer hover:tw-underline"
          onClick={() => {
            openImpactDescriptionModal("environmental");
          }}
        >
          Impacts environnementaux
        </h3>
        <Row>
          <div className={fr.cx("fr-col-lg-3", "fr-col-6")}>
            <SoilsCarbonStorageImpactCard
              onTitleClick={() => {
                openImpactDescriptionModal("environmental-carbon-storage");
              }}
              soilsCarbonStorageImpact={impacts.soilsCarbonStorage}
            />
          </div>
          {impacts.avoidedCO2TonsWithEnergyProduction && (
            <div className={fr.cx("fr-col-lg-3", "fr-col-6")}>
              <StoredAndAvoidedCO2ImpactCard
                reconversionProjectName={project.name}
                avoidedCO2TonsWithEnergyProduction={impacts.avoidedCO2TonsWithEnergyProduction}
                soilsCarbonStorage={impacts.soilsCarbonStorage}
              />
            </div>
          )}
          <div className={fr.cx("fr-col-lg-3", "fr-col-6")}>
            <PermeableSurfaceImpactChart
              reconversionProjectName={project.name}
              permeableSurfaceImpact={impacts.permeableSurfaceArea}
            />
          </div>
          {impacts.nonContaminatedSurfaceArea && (
            <div className={fr.cx("fr-col-lg-3", "fr-col-6")}>
              <ContaminatedSurfaceImpactChart
                reconversionProjectName={project.name}
                nonContaminatedSurfaceImpact={impacts.nonContaminatedSurfaceArea}
              />
            </div>
          )}
        </Row>
      </section>
      <section className={fr.cx("fr-pb-8v")}>
        <h3
          className="tw-cursor-pointer hover:tw-underline"
          onClick={() => {
            openImpactDescriptionModal("social");
          }}
        >
          Impacts sociaux
        </h3>
        <Row>
          <div className={fr.cx("fr-col-lg-3", "fr-col-6")}>
            <FullTimeJobsImpactCard
              reconversionProjectName={project.name}
              fullTimeJobsImpact={impacts.fullTimeJobs}
            />
          </div>
          {impacts.accidents && (
            <div className={fr.cx("fr-col-lg-3", "fr-col-6")}>
              <AccidentsImpactCard
                reconversionProjectName={project.name}
                accidentsImpact={impacts.accidents}
              />
            </div>
          )}
          {impacts.householdsPoweredByRenewableEnergy && (
            <div className={fr.cx("fr-col-lg-3", "fr-col-6")}>
              <HouseholdsPoweredByRenewableEnergyImpactCard
                reconversionProjectName={project.name}
                householdsPoweredByRenewableEnergy={impacts.householdsPoweredByRenewableEnergy}
                onTitleClick={() => {
                  openImpactDescriptionModal("social-households-powered-by-renewable-energy");
                }}
              />
            </div>
          )}
        </Row>
      </section>
    </div>
  );
};

export default ImpactsChartsView;
