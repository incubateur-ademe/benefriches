import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { aboutImpactsModal } from "./aboutImpactsModal";

const SectionTitle = ({ children }: { children: string }) => {
  return <h3 className="tw-text-base tw-mb-1">{children}</h3>;
};

function AboutImpactsModal() {
  return (
    <aboutImpactsModal.Component title="Comprendre les impacts" size="large">
      <section className="tw-mb-4">
        <SectionTitle>📊 Les indicateurs sont calculés à partir de données sourcées</SectionTitle>
        <p className="tw-mb-2">
          Vous trouverez dans cette page des indicateurs d'impacts économiques, sociaux et
          environnementaux (voire certains combinant les 2 premiers aspects), calculés à partir des
          données que vous avez saisies (ex : les surfaces des différents types de sol ou encore la
          quantité d'énergie renouvelable qui sera produite annuellement) et :
        </p>
        <ul>
          <li>
            de valeurs de référence compilées dans Bénéfriches à partir de publications sourcées
            (INSEE, France Stratégie, AGRESTE, ADEME, publications scientifiques, etc.)
          </li>
          <li>
            et/ou de bases de données accessible en{" "}
            <ExternalLink href="https://www.data.gouv.fr/fr/">opendata</ExternalLink> (dvf, etc.)
          </li>
          <li>
            et/ou d'hypothèses contextualisées (ex : temps de déplacement gagné par les habitants du
            fait de la création d'une nouvelle centralité à partir des données de l'
            <ExternalLink href="https://www.observatoire-des-territoires.gouv.fr/">
              Observatoire des territoires
            </ExternalLink>
            ).
          </li>
        </ul>
      </section>
      <section className="tw-mb-4">
        <SectionTitle>
          💰 Les indicateurs monétaires ne tiennent pas encore compte du coefficient d'actualisation
        </SectionTitle>
        <p>Ce sera le cas dans une prochaine version de l'outil.</p>
      </section>
      <section className="tw-mb-4">
        <SectionTitle>⚖️ Les indicateurs affichent la valeur différentielle</SectionTitle>
        <p>
          Dans cette page, les indicateurs monétarisés ne montrent pas une comparaison ni un état
          final mais un différentiel. C'est-à-dire la valeur issue de la monétarisation des impacts,
          en plus (bénéfices) ou en moins (dommages) que le projet va générer par rapport à la
          conservation du site dans son état.
        </p>
      </section>
      <section>
        <SectionTitle>💾 Cette page est consultable à tout moment</SectionTitle>
        <p>Vous pouvez la retrouver dans votre espace "Mes projets"</p>
      </section>
    </aboutImpactsModal.Component>
  );
}

export default AboutImpactsModal;
