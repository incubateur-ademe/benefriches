import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

type HowItWorksStepProps = {
  number: number;
  title: string;
  text: ReactNode;
};

function HowItWorksStep({ number, title, text }: HowItWorksStepProps) {
  return (
    <div className={fr.cx("fr-col-3")}>
      <div
        className={fr.cx("fr-mb-1w")}
        style={{
          color: "white",
          paddingTop: "11px",
          paddingRight: "1px",
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: "32px",
          width: "48px",
          height: "48px",
          background: "#137FEB",
        }}
      >
        {number}
      </div>
      <span className={fr.cx("fr-text--xl", "fr-text--bold")}>{title}</span>
      <p className={fr.cx("fr-text--sm", "fr-mt-1w")}>{text}</p>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className={fr.cx("fr-py-10w")} style={{ background: "#F6F6F6" }}>
      <div className={fr.cx("fr-container")}>
        <h2>Bénéfriches, comment ça marche ?</h2>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mt-5w")}>
          <HowItWorksStep
            number={1}
            title="Décrivez le site"
            text="Adresse, type de site, typologie des sols, pollution, gestion du site, etc. Si vous n’avez pas l’info, Bénéfriches vous propose des valeurs par défaut, basées sur des moyennes sur des sites similaires."
          />
          <HowItWorksStep
            number={2}
            title="Renseignez le projet"
            text="Type de projet, usage des sols, caractéristiques des bâtiments ou équipements, acteurs, coûts et recettes, calendrier, etc. Là aussi, si vous n’avez pas l’info, Bénéfriches vous propose des valeurs par défaut."
          />
          <HowItWorksStep
            number={3}
            title="Consultez les impacts"
            text={
              <span>
                Consultez les indicateurs du projet sur le site :{" "}
                <strong>
                  impacts économiques directs et indirects, impacts sociaux, impacts
                  environnementaux
                </strong>
                , sur différentes durées allant de 1 à 50 ans.
              </span>
            }
          />
          <HowItWorksStep
            number={4}
            title="Comparez les impacts"
            text={
              <span>
                Après avoir renseigné plusieurs sites et projets, vous comparez les impacts entre{" "}
                <strong>2 variantes</strong> d’un projet, <strong>2 projets différents</strong> sur
                un même site, un même projet sur <strong>2 sites différents</strong> ou un site{" "}
                <strong>avec et sans projet</strong>.
              </span>
            }
          />
        </div>
      </div>
    </section>
  );
}
