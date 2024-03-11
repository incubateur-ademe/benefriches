import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import ContaminatedSurfaceImpactChart from "./impacts/environment/ContaminatedSurfaceImpactCard";
import PermeableSurfaceImpactChart from "./impacts/environment/PermeableSurfaceImpactCard";
import ImpactChartCard from "./ImpactChartCard";

type Props = {
  project: {
    name: string;
    id: string;
    relatedSiteName: string;
  };
  impacts: {
    permeableSurfaceArea: {
      base: number;
      forecast: number;
      difference: number;
      greenSoil: {
        base: number;
        forecast: number;
        difference: number;
      };
      mineralSoil: {
        base: number;
        forecast: number;
        difference: number;
      };
    };
    contaminatedSurfaceArea?: {
      base: number;
      forecast: number;
      difference: number;
    };
  };
};

const Row = ({ children }: { children: ReactNode }) => {
  return <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>{children}</div>;
};

const ImpactsChartsView = ({ project, impacts }: Props) => {
  return (
    <div>
      <section>
        <Row>
          <div className={fr.cx("fr-col-6")}>
            <ImpactChartCard title="Analyse coûts bénéfices" />
          </div>
          <div className={fr.cx("fr-col-6")}>
            <ImpactChartCard title="Bilan de l'opération" />
            <ImpactChartCard title="Impacts socio-économiques" />
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
            <ImpactChartCard title="🧑‍🔧 Emplois équivalent temps plein" />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactChartCard title="💥 Accidents évités sur la friche" />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactChartCard title="🏠 Foyers alimentés par les EnR" />
          </div>
        </Row>
      </section>
    </div>
  );
};

export default ImpactsChartsView;
