import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { BENEFRICHES_SPREADSHEET_URL } from "../links";

type MilestoneItemProps = {
  title: string;
  text: ReactNode;
};

function MilestoneItem({ title, text }: MilestoneItemProps) {
  return (
    <li className="mr-12 list-none">
      <div className="w-52">
        <span className={fr.cx("fr-text--xl", "fr-text--bold")}>{title}</span>
        <p className={fr.cx("fr-text--sm", "fr-mt-1w")}>{text}</p>
      </div>
    </li>
  );
}

export default function MilestonesSection() {
  return (
    <section className={fr.cx("fr-container", "fr-py-10w")}>
      <h2>Les grandes dates de Bénéfriches</h2>
      <ul className={classNames("flex", "overflow-x-scroll", "mt-10 px-0")}>
        <MilestoneItem
          title="🐣 2018"
          text="Sur le constat qu'il n'existe aucune solution de calcul des impacts des projets d'aménagement, Laurent Chateau, expert friche de l'ADEME, imagine Bénéfriches. Un bureau d'étude est mandaté pour collecter les données et concevoir l'outil."
        />
        <MilestoneItem
          title="📈 2020"
          text={
            <>
              Publication de la première version de Bénéfriches : un{" "}
              <ExternalLink href={BENEFRICHES_SPREADSHEET_URL}>tableur Excel</ExternalLink>.
            </>
          }
        />
        <MilestoneItem
          title="🏗 2020-2023"
          text="7 projets de reconversion de friches sont accompagnées par Bénéfriches"
        />
        <MilestoneItem
          title="🧑‍💻 Été 2023"
          text="Lancement du projet de refonte de Bénéfriches : le tableur va devenir un produit SaaS. Conception UX et développement du produit."
        />
        <MilestoneItem
          title="⚡️ Printemps 2024"
          text="Première mise en ligne de Bénéfriche version SaaS, avec les fonctionnalités “Création de site”, “Création de projet”, “Consultation des impacts”. Le cas d'usage Centrale photovoltaïque est disponible."
        />
        <MilestoneItem
          title="🏘 Été 2024"
          text="Mise en ligne de la fonctionnalité 'Comparaison des impacts' et du cas d'usage 'Projet urbain'."
        />
        <MilestoneItem
          title="🌾 Automne-hiver 2024"
          text="Mise en ligne des cas d'usage Espace de nature et Ferme urbaine"
        />
        <MilestoneItem
          title="🔥 2025"
          text="Mise en ligne des cas d'usage : Centrale géothermique, Centrale biomasse, Centrale de méthanisation, Centrale agrivoltaïque."
        />
      </ul>
    </section>
  );
}
