import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import ProjectsComparisonActionBar from "../shared/actions/ActionBar";
import SocioEconomicBenefitsBarChart from "./SocioEconomicBenefitsBarChart";

type Props = {
  projectName: string;
  siteName: string;
};

type ImpactCardProps = {
  title: string;
  value: string;
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

const ImpactCard = ({
  title,
  value,
  text,
  isPositive = false,
}: ImpactCardProps) => {
  return (
    <div
      style={{ border: "2px solid gray", borderRadius: "9px" }}
      className={fr.cx("fr-py-2w", "fr-px-3w")}
    >
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
        {value}
      </h5>
      {text && <legend>{text}</legend>}
    </div>
  );
};

function ProjectImpactsPage({ projectName, siteName }: Props) {
  return (
    <div>
      <h2>{projectName}</h2>
      <h3>{siteName}</h3>
      <Notice
        title="Les indicateurs monétaires tiennent compte du coefficient d'actualisation sur la période sélectionnée."
        isClosable
        className={fr.cx("fr-mb-2w")}
      />
      <ProjectsComparisonActionBar />
      <div className={fr.cx("fr-mb-6w")}>
        <ImpactsRow>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Bilan économique"
              value="-9 794 959 €"
              text="pour Générale du Solaire"
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Impacts socio-économiques"
              value="+4 497 195 €"
              text="pour la communauté"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Emploi"
              value="+1,4 ETP"
              text="mobilisé"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Émissions de CO2-eq"
              value="3 952 t"
              isPositive
              text="évitées"
            />
          </div>
        </ImpactsRow>
        <ImpactsRow>
          <div className={fr.cx("fr-col-2")}>
            Stockage du carbone dans les sols
          </div>
        </ImpactsRow>
        <ImpactsRow>
          <div className={fr.cx("fr-col-2")}>
            Bénéficiaires des impacts socio-économiques
          </div>
        </ImpactsRow>
        <ImpactsRow>
          <div className={fr.cx("fr-col-2")}>
            Domaines concernés par les impacts socio-économiques
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
              value="+5 574 227 €"
              text="pour Générale du Solaire"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Revenu locatif"
              value="+381 974 €"
              text="pour la mairie de Blajan"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Recettes fiscales"
              value="+425 699 €"
              text="pour la collectivité"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Arrêt de la sécurisation de la friche"
              value="+3 624 908 €"
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
              title="Émissions de CO2-eq évitées grâce au stockage du carbone"
              value="+77 339 €"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Émissions de CO2-eq évitées grâce à la production d'ENR"
              value="+615 175 €"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Régulation de la qualité de l'eau"
              value="+9 471 €"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Aménité environnementale"
              value="+3 624 908 €"
              isPositive
            />
          </div>
        </div>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Pollinisation"
              value="+5 574 227 €"
              isPositive
              text="pour Générale du Solaire"
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Cycle de l'eau"
              value="+381 974 €"
              isPositive
              text="pour la mairie de Blajan"
            />
          </div>
        </div>
      </div>
      <div className={fr.cx("fr-mb-6w")}>
        <h4>Impacts sur les personnes</h4>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Emplois liés à la reconversion du site"
              value="+1,2 ETP"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Emplois liés à l'exploitation du site"
              value="+0,22 ETP"
              isPositive
            />
          </div>
        </div>
      </div>
      <div className={fr.cx("fr-mb-6w")}>
        <h4>État des surfaces</h4>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Surface perméable"
              value="+48 750 m2"
              isPositive
            />
          </div>
          <div className={fr.cx("fr-col-3")}>
            <ImpactCard
              title="Surface non polluée"
              value="+30 000 m2"
              isPositive
            />
          </div>
        </div>
      </div>
      <SocioEconomicBenefitsBarChart />
    </div>
  );
}

export default ProjectImpactsPage;
