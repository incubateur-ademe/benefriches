import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { ReconversionProjectImpacts } from "../../domain/impacts.types";
import CostBenefitAnalysisCard from "./impacts/cost-benefit-analysis/CostBenefitAnalysisCard";
import EconomicBalanceImpactCard from "./impacts/economic-balance/EconomicBalanceImpactCard";
import ContaminatedSurfaceImpactChart from "./impacts/environment/ContaminatedSurfaceImpactCard";
import PermeableSurfaceImpactChart from "./impacts/environment/PermeableSurfaceImpactCard";
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
          <div className={fr.cx("fr-col-3")}>
            <ImpactChartCard title="☁️ CO2-eq stocké ou évité" />
          </div>
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
          <div className={fr.cx("fr-col-3")}>
            <ImpactChartCard title="🏠 Foyers alimentés par les EnR" />
          </div>
        </Row>
      </section>
    </div>
  );
};

export default ImpactsChartsView;
