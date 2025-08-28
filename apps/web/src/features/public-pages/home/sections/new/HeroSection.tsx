import Button from "@codegouvfr/react-dsfr/Button";

export default function HeroSection() {
  return (
    <section className="tw-bg-[#007EAF]">
      <div className="fr-container tw-py-10 md:tw-py-0 tw-text-white tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-gap-8">
        <div className="tw-py-5">
          <h1 className="tw-text-5xl tw-font-bold tw-text-white">
            Calculez les impacts socio-économiques de votre projet d'aménagement.
          </h1>
          <p className="tw-text-sm">+ de 400 projets évalués</p>
          <Button
            size="large"
            className="tw-bg-white tw-text-[#000091] hover:!tw-bg-slate-200 focus:tw-bg-slate-200"
            linkProps={{ href: "#votre-projet-d-amenagement" }}
          >
            Commencer
          </Button>
        </div>
        <div>
          <img
            src="/img/new-homepage-hero.svg"
            className="lg:tw-h-full lg:tw-w-[400px] tw-w-full"
            aria-hidden="true"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
