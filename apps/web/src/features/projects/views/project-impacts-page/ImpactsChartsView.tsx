import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { ReconversionProjectImpacts } from "../../domain/impacts.types";
import CostBenefitAnalysisCard from "./impacts/cost-benefit-analysis/CostBenefitAnalysisCard";
import EconomicBalanceImpactCard from "./impacts/economic-balance/EconomicBalanceImpactCard";
import ContaminatedSurfaceImpactChart from "./impacts/environment/ContaminatedSurfaceImpactCard";
import HouseholdsPoweredByRenewableEnergyImpactCard from "./impacts/environment/HouseholdsPoweredByRenewableEnergyImpactCard";
import PermeableSurfaceImpactChart from "./impacts/environment/PermeableSurfaceImpactCard";
import StoredAndAvoidedCO2ImpactCard from "./impacts/environment/StoredAndAvoidedCO2ImpactCard";
import AccidentsImpactCard from "./impacts/social/AccidentsImpactCard";
import FullTimeJobsImpactCard from "./impacts/social/FullTimeJobsImpactCard";
import ImpactChartCard from "./ImpactChartCard";

type Props = {
  project: {
    name: string;
  };
  impacts: ReconversionProjectImpacts;
};

const Row = ({ children }: { children: ReactNode }) => {
  return <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>{children}</div>;
};

const ImpactsChartsView = ({ project, impacts }: Props) => {
  return (
    <div>
      <section className={fr.cx("fr-pb-8v")}>
        <h3>Impacts économiques</h3>
        <Row>
          <div className={fr.cx("fr-col-6")}>
            <CostBenefitAnalysisCard
              economicBalanceTotal={impacts.economicBalance.total}
              socioEconomicImpactTotal={258000}
            />
          </div>
          <div className={fr.cx("fr-col-6")}>
            <EconomicBalanceImpactCard
              costs={impacts.economicBalance.costs}
              revenues={impacts.economicBalance.revenues}
            />
            <div className="fr-mt-3w">
              <ImpactChartCard title="Impacts socio-économiques" />
            </div>
          </div>
        </Row>
      </section>
      <section className={fr.cx("fr-pb-8v")}>
        <h3>Impacts environnementaux</h3>
        <Row>
          <div className={fr.cx("fr-col-3")}>
            <ImpactChartCard title="🍂 Carbone stocké dans les sols" />
          </div>
          {impacts.avoidedCO2TonsWithEnergyProduction && (
            <div className={fr.cx("fr-col-3")}>
              <StoredAndAvoidedCO2ImpactCard
                reconversionProjectName={project.name}
                avoidedCO2TonsWithEnergyProduction={impacts.avoidedCO2TonsWithEnergyProduction}
              />
            </div>
          )}
          <div className={fr.cx("fr-col-3")}>
            <PermeableSurfaceImpactChart
              reconversionProjectName={project.name}
              permeableSurfaceImpact={impacts.permeableSurfaceArea}
            />
          </div>
          {impacts.contaminatedSurfaceArea && (
            <div className={fr.cx("fr-col-3")}>
              <ContaminatedSurfaceImpactChart
                reconversionProjectName={project.name}
                contaminatedSurfaceImpact={impacts.contaminatedSurfaceArea}
              />
            </div>
          )}
        </Row>
      </section>
      <section className={fr.cx("fr-pb-8v")}>
        <h3>Impacts sociaux</h3>
        <Row>
          <div className={fr.cx("fr-col-3")}>
            <FullTimeJobsImpactCard
              reconversionProjectName={project.name}
              fullTimeJobsImpact={impacts.fullTimeJobs}
            />
          </div>
          {impacts.accidents && (
            <div className={fr.cx("fr-col-3")}>
              <AccidentsImpactCard
                reconversionProjectName={project.name}
                accidentsImpact={impacts.accidents}
              />
            </div>
          )}
          {impacts.householdsPoweredByRenewableEnergy && (
            <div className={fr.cx("fr-col-3")}>
              <HouseholdsPoweredByRenewableEnergyImpactCard
                reconversionProjectName={project.name}
                householdsPoweredByRenewableEnergy={impacts.householdsPoweredByRenewableEnergy}
              />
            </div>
          )}
        </Row>
      </section>
    </div>
  );
};

export default ImpactsChartsView;
