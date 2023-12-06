import { ReactNode, useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import ProjectsComparisonActionBar from "../shared/actions/ActionBar";
import CarbonStorageChart from "./charts/CarbonStorageChart";
import SocioEconomicBenefitsBarChart from "./charts/SocioEconomicBenefitsBarChart";
import SocioEconomicBenefitsByDomainChart from "./charts/SocioEconomicBenefitsByDomainChart";
import ProjectsImpactsPageHeader from "./ProjectImpactsPageHeader";

type Props = {
  projectId: string;
  projectName: string;
  siteName: string;
};

type ImpactIndicatorProps = {
  title: string;
  impact: string;
  isPositive?: boolean;
  text?: string;
};

const ImpactsRow = ({ children }: { children: ReactNode }) => {
  return (
    <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
      {children}
    </div>
  );
};
const ImpactContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{ border: "2px solid gray", borderRadius: "9px" }}
      className={fr.cx("fr-py-2w", "fr-px-3w")}
    >
      {children}
    </div>
  );
};

const ImpactCard = ({
  title,
  impact,
  isPositive,
  text,
}: ImpactIndicatorProps) => {
  return (
    <ImpactContainer>
      <p>
        <strong>{title}</strong>
      </p>
      <h5
        className={fr.cx("fr-mb-1v")}
        style={{
          color: `var(${
            isPositive ? "--text-default-success" : "--text-default-error"
          })`,
        }}
      >
        {impact}
      </h5>
      {text && <legend>{text}</legend>}
    </ImpactContainer>
  );
};

function ProjectImpactsPage({ projectId, projectName, siteName }: Props) {
  ``;
  const [selectedFilter, setSelectedFilter] = useState<"all" | "monetary">(
    "all",
  );

  return (
    <div>
      <ProjectsImpactsPageHeader
        projectId={projectId}
        projectName={projectName}
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
            <ImpactCard
              title="💰 Bilan économique"
              impact="-9 794 959 €"
              text="pour Générale du Solaire"
            />
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
                <ImpactCard
                  title="💼 Emploi"
                  impact="+1,4 ETP"
                  text="mobilisé"
                  isPositive
                />
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
        <p>
          Economies, bénéfices ou déficits réalisés une fois le site reconverti
        </p>
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
            <ImpactCard
              title="Revenu locatif"
              impact="+381 974 €"
              text="pour Imerys"
              isPositive
            />
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
        <p>
          Monétarisation des services rendus à la société humaine par la nature
          et le projet
        </p>
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
            <ImpactCard
              title="🫧 Régulation de la qualité de l'eau"
              impact="+9 471 €"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard title="🚵 Aménité environnementale" impact="-2 083 €" />
          </div>
        </div>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="🐝 Pollinisation"
              impact="-606 €"
              text="pour Générale du Solaire"
            />
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
                impact="+48 750 m2"
                isPositive
              />
            </div>
            <div className={fr.cx("fr-col-3")}>
              <ImpactCard
                title="✨ Surface non polluée"
                impact="+30 000 m2"
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
