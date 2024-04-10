import { fr } from "@codegouvfr/react-dsfr";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

function AccessibilitePage() {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <h1>Déclaration d'accessibilité</h1>
      <p>
        Établie le <em>5 février 2024</em>.
      </p>
      <p>
        <strong>L'ADEME</strong> s’engage à rendre son service accessible, conformément à l’article
        47 de la loi n° 2005-102 du 11 février 2005.
      </p>
      <p>
        Cette déclaration d’accessibilité s’applique à <strong>Bénéfriches</strong>{" "}
        <a href="https://benefriches.ademe.fr">(https://benefriches.ademe.fr)</a>.
      </p>
      <h2>État de conformité</h2>
      <p>
        <strong>Bénéfriches</strong> est <strong>non conforme</strong> avec le{" "}
        <abbr title="Référentiel général d’amélioration de l’accessibilité">RGAA</abbr>.{" "}
        <span>Le site n’a encore pas été audité.</span>
      </p>
      <h2>Contenus non accessibles</h2>
      <p>Non applicable</p>
      <h2>Amélioration et contact</h2>
      <p>
        Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
        responsable de <strong>Bénéfriches</strong> pour être orienté vers une alternative
        accessible ou obtenir le contenu sous une autre forme.
      </p>
      <ul className="basic-information feedback h-card">
        <li>
          <ExternalLink href="https://tally.so/r/wvAdk8">
            Formulaire de contact Bénéfriches
          </ExternalLink>
        </li>
        <li>
          Téléphone&nbsp;: <ExternalLink href="tel:+33147652000">01 47 65 20 00</ExternalLink>
        </li>

        <li>
          Adresse&nbsp;: <address>155 bis Av. Pierre Brossolette 92240 Montrouge</address>
        </li>
      </ul>
      <h2>Voie de recours</h2>
      <p>
        Cette procédure est à utiliser dans le cas suivant&nbsp;: vous avez signalé au responsable
        du site internet un défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un
        des services du portail et vous n’avez pas obtenu de réponse satisfaisante.
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
      <p>
        Cette déclaration d’accessibilité a été créé le <span>5 février 2024</span> grâce au{" "}
        <ExternalLink href="https://betagouv.github.io/a11y-generateur-declaration/#create">
          Générateur de Déclaration d’Accessibilité de BetaGouv
        </ExternalLink>
        .
      </p>
    </section>
  );
}

export default AccessibilitePage;
