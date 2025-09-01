import Button from "@codegouvfr/react-dsfr/Button";

export default function HeroSection() {
  return (
    <section className="bg-[#007EAF]">
      <div className="fr-container py-10 md:py-0 text-white flex flex-col md:flex-row md:items-center gap-8">
        <div className="py-5">
          <h1 className="text-5xl font-bold text-white">
            Calculez les impacts socio-économiques de votre projet d'aménagement.
          </h1>
          <p className="text-sm">+ de 400 projets évalués</p>
          <Button
            size="large"
            className="bg-white text-[#000091] hover:bg-slate-200! focus:bg-slate-200"
            linkProps={{ href: "#votre-projet-d-amenagement" }}
          >
            Commencer
          </Button>
        </div>
        <div>
          <img
            src="/img/new-homepage-hero.svg"
            className="lg:h-full lg:w-[400px] w-full"
            aria-hidden="true"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
