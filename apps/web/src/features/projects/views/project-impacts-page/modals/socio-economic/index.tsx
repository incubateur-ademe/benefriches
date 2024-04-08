import { fr } from "@codegouvfr/react-dsfr";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

const SocioEconomicDescription = () => {
  return (
    <>
      <p>
        L’évaluation socio-économique a pour objet d’apprécier l’intérêt d’un projet ou d’un
        investissement pour la collectivité.
      </p>
      <p>
        Elle est réalisée en analysant les effets du projet (ses impacts) sur les différents types
        d’acteurs directement ou indirectement concernés, que ces impacts soient positifs ou
        négatifs. On parle alors d’impacts socio-économiques.
      </p>
      <p>
        S’agissant de projets de renouvellement urbain, les impacts sont nombreux et de différentes
        natures :
      </p>
      <ul>
        <li>
          environnementaux (ex : maintien de capacité de stockage de carbone dans les sols, création
          d’ilots de fraicheur),
        </li>
        <li>
          économiques (ex : réduction de dépenses futures en entretien de réseaux ou voiries),
        </li>
        <li>
          sociaux (ex : création d’aménités, amélioration de l’attractivité d’un quartier, réduction
          du besoin en en déplacements, etc.)
        </li>
      </ul>
      Les différents indicateurs utilisés dans Bénéfriches sont présentés ci-dessous et leurs
      méthodes de calcul sont détaillées au niveau de chacun.
      <h2 className={fr.cx("fr-h5")}>Aller plus loin</h2>
      <ul>
        <li>
          Évaluer les bénéfices socio-économiques de la reconversion de friches pour lutter contre
          l'artificialisation :{" "}
          <ExternalLink href="https://librairie.ademe.fr/changement-climatique-et-energie/3772-evaluer-les-benefices-socio-economiques-de-la-reconversion-de-friches-pour-lutter-contre-l-artificialisation-outil-benefriches.html">
            Outil Bénéfriches.
          </ExternalLink>
        </li>
        <li>
          Évaluation socioéconomique des opérations d’aménagement urbain :{" "}
          <ExternalLink href="https://www.strategie.gouv.fr/publications/referentiel-methodologique-de-levaluation-socioeconomique-operations-damenagement">
            Référentiel&nbsp;méthodologique
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};

export default SocioEconomicDescription;
