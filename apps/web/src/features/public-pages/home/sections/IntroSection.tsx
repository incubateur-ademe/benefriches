import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

import classNames from "@/shared/views/clsx";

export default function IntroSection() {
  return (
    <div className="tw-overflow-hidden">
      <section className={classNames("fr-container tw-py-8", "md:max-lg:tw-px-32", "lg:tw-py-20")}>
        <div className="tw-flex tw-flex-col lg:tw-flex-row tw-gap-8 lg:tw-gap-4">
          <div className="lg:tw-flex-[7] lg:tw-margin-auto">
            <h1>Bénéfriches, l'outil qui calcule la valeur réelle de votre projet d'aménagement</h1>
            <p className={fr.cx("fr-text--xl")}>
              Bénéfriches quantifie et monétarise les impacts{" "}
              <strong>environnementaux, sociaux et économiques</strong> d'un projet d'aménagement,
              sur <strong>friche</strong> ou en <strong>extension urbaine</strong>.
            </p>
            <Button priority="primary" linkProps={{ href: "#cta-section" }}>
              Calculer les impacts de votre projet
            </Button>
          </div>
          <div className="lg:tw-flex-[5]">
            <img
              src="/img/home-hero.png"
              className="tw-w-full"
              alt="Capture d'écran de Bénéfriches : page impacts d'un projet d'aménagement"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
