import { fr } from "@codegouvfr/react-dsfr";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

function AccessibilitePage() {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <HtmlTitle>Accessibilité</HtmlTitle>
      <h1>Déclaration d'accessibilité</h1>
      <p>
        Établie le <em>19 août 2025</em>.
      </p>
      <p>
        <strong>L'ADEME</strong> s’engage à rendre ses sites internet, intranet, extranet et ses
        applications mobiles, etc. accessibles conformément à l’article 47 de la loi n° 2005-102 du
        11 février 2005.
      </p>
      <p>A cette fin, il met en œuvre la stratégie et les actions suivantes&nbsp;:</p>
      <ul>
        <li>
          <ExternalLink href="https://librairie.ademe.fr/institutionnel/6794-schema-pluriannuel-de-mise-en-accessibilite-des-sites-web-de-l-ademe-2024-2026.html">
            Schéma pluriannuel en cours
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://librairie.ademe.fr/institutionnel/6823-plan-annuel-de-mise-en-accessibilite-des-sites-web-de-l-ademe.html">
            Plan d’action de l’année en cours
          </ExternalLink>
        </li>
      </ul>
      <p>
        Cette déclaration d'accessibilité s'applique au site
        <a href="https://benefriches.ademe.fr">(https://benefriches.ademe.fr)</a>.
      </p>
      <h2>État de conformité</h2>
      <p>
        En l’absence d’audit et dans l’attente de celui-ci, le site{" "}
        <a href="https://benefriches.ademe.fr">(https://benefriches.ademe.fr)</a> n’est pas en
        conformité avec le référentiel général d’amélioration de l’accessibilité. Les
        non-conformités et/ou les dérogations sont énumérées ci-dessous.
      </p>
      <h2>Contenus non accessibles</h2>
      <p>Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes.</p>

      <h3>Non-conformité</h3>

      <p>Néant</p>

      <h3>Dérogations pour charge disproportionnée</h3>

      <p>Néant</p>

      <h3>Contenus non soumis à l’obligation d’accessibilité</h3>

      <p>Néant</p>

      <h2>Établissement de cette déclaration d'accessibilité</h2>

      <p>Cette déclaration a été établie le 19/08/2025.</p>

      <ul>
        <li>
          Technologies utilisées pour la réalisation du site web&nbsp;:
          <ul>
            <li>Infrastructure langage&nbsp;: React.</li>
            <li>Infrastructure CMS&nbsp;: Néant.</li>
          </ul>
        </li>
        <li>
          Agents utilisateurs, technologies d’assistance et outils utilisés pour vérifier
          l’accessibilité
          <ul>
            <li>
              Les tests des pages web ont été effectués avec les combinaisons de navigateurs web et
              lecteurs d’écran suivants&nbsp;: Néant
            </li>
            <li>Les outils suivants ont été utilisés lors de l’évaluation&nbsp;: Néant</li>
            <li>Pages du site ayant fait l’objet de la vérification de conformité&nbsp;: Néant</li>
          </ul>
        </li>
      </ul>

      <h2>Retour d'information et contact</h2>
      <p>
        Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
        responsable du site internet pour être orienté vers une alternative accessible ou obtenir le
        contenu sous une autre forme.
      </p>
      <ul className="basic-information feedback h-card">
        <li>
          <ExternalLink href="https://tally.so/r/wvAdk8">
            Envoyer un message au référent accessibilité de l'ADEME
          </ExternalLink>
        </li>
        <li>
          Contacter Estelle Ribot, ADEME, DEMTE — 20 avenue du Grésillé BP 90 406 – 49 004 Angers
          Cedex 01
        </li>
      </ul>
      <h2>Voie de recours</h2>
      <p>
        Cette procédure est à utiliser dans le cas suivant&nbsp;: vous avez signalé au responsable
        du site internet un défaut d'accessibilité qui vous empêche d'accéder à un contenu ou à un
        des services du portail et vous n'avez pas obtenu de réponse satisfaisante.
      </p>
      <p>Vous pouvez&nbsp;:</p>
      <ul>
        <li>
          Écrire un message au{" "}
          <ExternalLink href="https://formulaire.defenseurdesdroits.fr/">
            Défenseur des droits
          </ExternalLink>
        </li>
        <li>
          Contacter{" "}
          <ExternalLink href="https://www.defenseurdesdroits.fr/saisir/delegues">
            le délégué du Défenseur des droits dans votre région
          </ExternalLink>
        </li>
        <li>
          Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre)&nbsp;:
          <address>
            Défenseur des droits
            <br />
            Libre réponse 71120 75342 Paris CEDEX 07
          </address>
        </li>
      </ul>
      <hr></hr>
    </section>
  );
}

export default AccessibilitePage;
