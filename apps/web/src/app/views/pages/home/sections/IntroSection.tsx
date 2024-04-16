import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

export default function IntroSection() {
  return (
    <section className={fr.cx("fr-container", "fr-py-10w", "fr-pr-md-0")}>
      <div className={fr.cx("fr-grid-row")}>
        <div className={fr.cx("fr-col-12", "fr-col-md-7", "fr-pr-md-6w", "fr-m-auto")}>
          <h1>Bénéfriches, l'outil qui calcule la valeur réelle de votre projet d'aménagement</h1>
          <p className={fr.cx("fr-text--xl")}>
            Bénéfriches quantifie et monétarise les impacts{" "}
            <strong>environnementaux, sociaux et économiques</strong> d'un projet d'aménagement, sur{" "}
            <strong>friche</strong> ou en <strong>extension urbaine</strong>.
          </p>
          <Button priority="primary" linkProps={{ href: "#cta-section" }}>
            Calculer les impacts de votre projet
          </Button>
        </div>
        <div className={fr.cx("fr-col-12", "fr-col-md-5", "fr-pt-10v", "fr-pt-md-0")}>
          <img
            src="/img/home-intro.svg"
            className="tw-w-full md:tw-w-auto"
            alt="capture d’écran de l’outil Bénéfriches"
          />
        </div>
      </div>
    </section>
  );
}
