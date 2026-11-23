import { routes } from "@/app/router";

export default function NotFoundScreen() {
  return (
    <div className="fr-container fr-my-10w">
      <div className="fr-grid-row fr-grid-row--center">
        <div className="fr-col-12 fr-col-md-8">
          <p aria-hidden="true" style={{ fontSize: "4rem" }}>
            🧭
          </p>
          <p className="fr-text--sm fr-mb-1w uppercase">Erreur 404</p>
          <h1>Page non trouvée</h1>
          <p className="fr-text--lead">
            Nous n'avons pas trouvé la page que vous cherchez. Elle a peut-être changé d'adresse, ou
            n'existe plus.
          </p>
          <p>Si vous avez saisi l'adresse dans votre navigateur, vérifiez qu'elle est correcte.</p>
          <ul className="fr-btns-group fr-btns-group--inline-md">
            <li>
              <a className="fr-btn" {...routes.home().link}>
                Retour à l'accueil
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
