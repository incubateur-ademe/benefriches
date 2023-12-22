import { ReactNode, useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { Project } from "../../domain/projects.types";
import ProjectsComparisonActionBar from "../shared/actions/ActionBar";
import CarbonStorageChart from "./impacts/carbon-storage";
import EconomicResults from "./impacts/economic-results";
import ImpactCard from "./impacts/ImpactCard";
import ImpactContainer from "./impacts/ImpactContainer";
import SocioEconomicBenefitsBarChart from "./impacts/socio-economic/SocioEconomicBenefitsBarChart";
import SocioEconomicBenefitsByDomainChart from "./impacts/socio-economic/SocioEconomicBenefitsByDomainChart";
import ProjectsImpactsPageHeader from "./ProjectImpactsPageHeader";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";

type SuccessDataProps = {
  projectId: string;
  projectData: Project;
  siteName: string;
  loadingState: "success";
};

type ErrorOrLoadingDataProps = {
  projectId: string;
  projectData: undefined;
  siteName: undefined;
  loadingState: "idle" | "error" | "loading";
};

type Props = SuccessDataProps | ErrorOrLoadingDataProps;

const ImpactsRow = ({ children }: { children: ReactNode }) => {
  return <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>{children}</div>;
};

function ProjectImpactsPage({ projectId, projectData, siteName, loadingState }: Props) {
  ``;
  const [selectedFilter, setSelectedFilter] = useState<"all" | "monetary">("all");

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
      <ProjectsImpactsPageHeader
        projectId={projectId}
        projectName={projectData.name}
        siteName={siteName}
      />
      <Notice
        title="Les indicateurs montrent le différentiel entre la situation actuelle et la situation avec le projet, sur la période sélectionnée"
        isClosable
        className={fr.cx("fr-mb-2w")}
      />
      <Notice
        title="Les indicateurs monétaires tiennent compte du coefficient d'actualisation sur la période sélectionnée."
        isClosable
        className={fr.cx("fr-mb-2w")}
      />
      <ProjectsComparisonActionBar
        selectedFilter={selectedFilter}
        onMonetaryFilterClick={() => setSelectedFilter("monetary")}
        onAllFilterClick={() => setSelectedFilter("all")}
      />
      <div className={fr.cx("fr-mb-6w")}>
        <ImpactsRow>
          <div className={fr.cx("fr-col-3")}>
            <EconomicResults projectData={projectData} duration={10} />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="🌍 Impacts socio-économiques"
              impact="+5 024 394 €"
              text="pour la communauté"
              isPositive
            />
          </div>
          {selectedFilter === "all" && (
            <>
              <div className={fr.cx("fr-col-3")}>
                <ImpactCard title="💼 Emploi" impact="+1,4 ETP" text="mobilisé" isPositive />
              </div>
              <div className={fr.cx("fr-col-3")}>
                <ImpactCard
                  title="☁️ Émissions de CO2-eq"
                  impact="3 952 t"
                  isPositive
                  text="évitées"
                />
              </div>
            </>
          )}
        </ImpactsRow>
        <ImpactsRow>
          {selectedFilter === "all" && (
            <div className={fr.cx("fr-col-6")}>
              <ImpactContainer>
                <CarbonStorageChart />
              </ImpactContainer>
            </div>
          )}
          <div className={fr.cx("fr-col-6")}>
            <ImpactContainer>
              <SocioEconomicBenefitsBarChart />
            </ImpactContainer>
          </div>
        </ImpactsRow>
        <ImpactsRow>
          <div className={fr.cx("fr-col-md")}>
            <ImpactContainer>
              <SocioEconomicBenefitsByDomainChart />
            </ImpactContainer>
          </div>
        </ImpactsRow>
      </div>
      <div className={fr.cx("fr-mb-6w")}>
        <h4>Retombées économiques</h4>
        <p>Economies, bénéfices ou déficits réalisés une fois le site reconverti</p>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Recettes d'exploitation"
              impact="+5 574 227 €"
              text="pour Générale du Solaire"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard title="Revenu locatif" impact="+381 974 €" text="pour Imerys" isPositive />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Recettes fiscales"
              impact="+425 699 €"
              text="pour la collectivité"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Arrêt de la sécurisation de la friche"
              impact="+3 624 908 €"
              text="pour Terre Cuit d'Occitanie"
              isPositive
            />
          </div>
        </div>
      </div>
      <div className={fr.cx("fr-mb-6w")}>
        <h4>Services écosystémiques</h4>
        <p>Monétarisation des services rendus à la société humaine par la nature et le projet</p>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="🍂 Émissions de CO2-eq évitées grâce au stockage du carbone"
              impact="+77 339 €"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="🔆 Émissions de CO2-eq évitées grâce à la production d'ENR"
              impact="+615 175 €"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard title="🫧 Régulation de la qualité de l'eau" impact="+9 471 €" isPositive />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard title="🚵 Aménité environnementale" impact="-2 083 €" />
          </div>
        </div>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard title="🐝 Pollinisation" impact="-606 €" text="pour Générale du Solaire" />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="💧 Cycle de l'eau"
              impact="+508 €"
              isPositive
              text="pour la mairie de Blajan"
            />
          </div>
        </div>
      </div>
      {selectedFilter === "all" && (
        <div className={fr.cx("fr-mb-6w")}>
          <h4>Impacts sur les personnes</h4>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <div className={fr.cx("fr-col-3")}>
              <ImpactCard
                title="👷 Emplois liés à la reconversion du site"
                impact="+1,2 ETP"
                isPositive
              />
            </div>
            <div className={fr.cx("fr-col-3")}>
              <ImpactCard
                title="🧑‍🔧 Emplois liés à l'exploitation du site"
                impact="+0,22 ETP"
                isPositive
              />
            </div>
          </div>
        </div>
      )}
      {selectedFilter === "all" && (
        <div className={fr.cx("fr-mb-6w")}>
          <h4>État des surfaces</h4>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <div className={fr.cx("fr-col-3")}>
              <ImpactCard
                title="🌧 Surface perméable"
                impact={`+48 750 ${SQUARE_METERS_HTML_SYMBOL}`}
                isPositive
              />
            </div>
            <div className={fr.cx("fr-col-3")}>
              <ImpactCard
                title="✨ Surface non polluée"
                impact={`+30 000 ${SQUARE_METERS_HTML_SYMBOL}`}
                isPositive
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectImpactsPage;
