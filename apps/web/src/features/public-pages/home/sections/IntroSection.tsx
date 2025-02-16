import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

import classNames from "@/shared/views/clsx";

export default function IntroSection() {
  return (
    <div className="tw-overflow-hidden">
      <section className={classNames("fr-container tw-py-8", "md:max-lg:tw-px-32", "lg:tw-py-20")}>
        <div className="tw-flex tw-flex-col lg:tw-flex-row">
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
          <div
            className={classNames("tw-relative tw-pt-10", "lg:tw-flex-[5] lg:tw-pl-12 lg:tw-pt-0")}
          >
            <img
              src="/img/home-intro.svg"
              className="tw-w-full lg:tw-w-auto lg:tw-absolute"
              alt="Capture d'écran de Bénéfriches : page impacts d'un projet d'aménagement"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
