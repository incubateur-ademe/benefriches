import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

import classNames from "@/shared/views/clsx";

export default function IntroSection() {
  return (
    <div className="overflow-hidden">
      <section className={classNames("fr-container py-8", "md:max-lg:px-32", "lg:py-20")}>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
          <div className="lg:flex-[7] lg:margin-auto">
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
          <div className="lg:flex-[5]">
            <img src="/img/home-hero.png" className="w-full" aria-hidden="true" alt="" />
          </div>
        </div>
      </section>
    </div>
  );
}
