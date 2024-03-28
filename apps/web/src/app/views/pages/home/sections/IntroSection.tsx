import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

export default function IntroSection() {
  return (
    <section className={fr.cx("fr-container", "fr-py-10w", "fr-pr-0")}>
      <div className={fr.cx("fr-grid-row")}>
        <div className={fr.cx("fr-col-7", "fr-pr-6w", "fr-m-auto")}>
          <h1>Bénéfriches</h1>
          <h2>L'outil qui calcule la valeur réelle d'un projet d'aménagement urbain</h2>
          <p className={fr.cx("fr-text--xl")}>
            Bénéfriches est un outil unmérique qui quantifie et monétarise les impacts{" "}
            <strong>environnementaux, sociaux et économiques</strong> d'un projet d'aménagement, sur{" "}
            <strong>friche</strong> ou en <strong>extension urbaine</strong>.
          </p>
          <Button priority="primary" linkProps={{ href: "#cta-section" }}>
            Calculer les impacts de votre projet
          </Button>
        </div>
        <div className={fr.cx("fr-col-5")}>
          <img src="/img/home-intro.svg" />
        </div>
      </div>
    </section>
  );
}
