import { fr } from "@codegouvfr/react-dsfr";

function MentionsLegalesPage() {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <h1>Mentions légales</h1>
      <h2>Éditeur de la plateforme</h2>
      <p>
        Bénéfriches est édité par l&#x27;accélérateur de la transition écologique de l&#x27;ADEME
        situé :
      </p>
      <address>
        <p>
          155 bis Av. Pierre Brossolette
          <br />
          92240 Montrouge
          <br />
          <a href="tel:+33147652000" target="_blank" rel="nofollow noopener noreferrer">
            01 47 65 20 00
          </a>
          <br />
          <a href="https://ademe.fr" target="_blank" rel="nofollow noopener noreferrer">
            https://ademe.fr
          </a>
        </p>
      </address>
      <h2 id="directeur-de-la-publication">Directeur de la publication</h2>
      <p>
        Le directeur de publication est M. Boris RAVIGNON, agissant en qualité de
        Président-directeur général de l’ADEME.
      </p>
      <p>
        La personne responsable de l’accès aux documents administratifs et des questions relatives à
        la réutilisation des informations est Monsieur Luc MORINIÈRE en qualité de Chef du service
        des affaires juridiques.
      </p>
      <h2 id="h-bergement-du-site">Hébergement du site</h2>
      Ce site est hébergé par Scalingo SAS
      <address>
        <p>
          9 rue de la Krutenau
          <br />
          67100 Strasbourg
          <br />
          <a href="https://scalingo.com/fr" target="_blank" rel="nofollow noopener noreferrer">
            https://scalingo.com/fr
          </a>
        </p>
      </address>
      <h2 id="propri-t-intellectuelle">Propriété intellectuelle</h2>
      <p>
        Bénéfriches est une marque déposée par l&#x27;ADEME. Toute reproduction totale ou partielle
        de cette marque sans autorisation préalable et écrite est prohibée.
      </p>
      <h2 id="accessibilit">Accessibilité</h2>
      <p>
        La conformité aux normes d&#x27;accessibilité numérique est un objectif ultérieur mais
        tâchons de rendre ce site accessible à toutes et tous, conformément à l&#x27;article 47 de
        la loi n°2005-102 du 11 février 2005.
      </p>
      <h3 id="signaler-un-dysfonctionnement">Signaler un dysfonctionnement</h3>
      <p>
        Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou une
        fonctionnalité du site, merci de nous en faire part. Si vous n’obtenez pas de réponse rapide
        de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine
        au Défenseur des droits.
      </p>
      <p>
        Pour en savoir plus sur la politique d’accessibilité numérique de l’État:{" "}
        <a
          href="http://references.modernisation.gouv.fr/accessibilite-numerique"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          http://references.modernisation.gouv.fr/accessibilite-numerique
        </a>
      </p>
      <h3 id="s-curit">Sécurité</h3>
      <p>
        Le site est protégé par un certificat électronique, matérialisé pour la grande majorité des
        navigateurs par un cadenas. Cette protection participe à la confidentialité des échanges. En
        aucun cas les services associés à la plateforme ne seront à l’origine d’envoi d&#x27;emails
        pour demander la saisie d’informations personnelles.
      </p>
      <h2 id="modification-des-mentions-l-gales">Modification des mentions légales</h2>
      <p>
        L’ADEME se réserve le droit de modifier les présentes mentions légales à tout moment.
        L’utilisateur est lié par les conditions en vigueur lors de sa visite.
      </p>
    </section>
  );
}

export default MentionsLegalesPage;
