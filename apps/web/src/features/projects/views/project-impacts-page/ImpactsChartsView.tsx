import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { ReconversionProjectImpacts } from "../../domain/impacts.types";
import ContaminatedSurfaceImpactChart from "./impacts/environment/ContaminatedSurfaceImpactCard";
import HouseholdsPoweredByRenewableEnergyImpactCard from "./impacts/environment/HouseholdsPoweredByRenewableEnergyImpactCard";
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
      <section>
        <h3>Impacts économiques</h3>
        <Row>
          <div className={fr.cx("fr-col-6")}>
            <ImpactChartCard title="Analyse coûts bénéfices" />
          </div>
          <div className={fr.cx("fr-col-6")}>
            <ImpactChartCard title="Bilan de l'opération" />
            <div className="fr-mt-3w">
              <ImpactChartCard title="Impacts socio-économiques" />
            </div>
          </div>
        </Row>
      </section>
      <section>
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
      <section>
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
